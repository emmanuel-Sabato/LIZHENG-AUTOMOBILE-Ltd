const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create new order/inquiry
// @route   POST /api/orders
// @access  Public
router.post('/', async (req, res) => {
    try {
        const {
            name, email, phone, whatsapp,
            location, language, method, carId
        } = req.body;

        // 1. Find or Create Customer
        let customer = await Customer.findOne({ email });
        if (!customer) {
            customer = await Customer.create({
                name, email, phone, whatsapp, location, language, method
            });
        } else {
            // Update existing customer info
            customer.name = name;
            customer.phone = phone;
            customer.whatsapp = whatsapp;
            customer.location = location;
            customer.language = language;
            customer.method = method;
            await customer.save();
        }

        // 2. Create Order
        const order = await Order.create({
            customer: customer._id,
            car: carId,
            status: 'new',
            source: 'website'
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('customer')
            .populate('car')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private/Admin
router.get('/customers', protect, async (req, res) => {
    try {
        const customers = await Customer.find({}).lean();

        const customersWithStats = await Promise.all(customers.map(async (cust) => {
            const totalInquiries = await Order.countDocuments({ customer: cust._id });
            const lastInquiry = await Order.findOne({ customer: cust._id }).sort({ createdAt: -1 });

            return {
                ...cust,
                totalInquiries,
                lastContact: lastInquiry ? lastInquiry.createdAt : cust.createdAt
            };
        }));

        res.json(customersWithStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update customer status
// @route   PUT /api/orders/customers/:id/status
// @access  Private/Admin
router.put('/customers/:id/status', protect, async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (customer) {
            customer.status = req.body.status || customer.status;
            const updatedCustomer = await customer.save();
            res.json(updatedCustomer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete customer
// @route   DELETE /api/orders/customers/:id
// @access  Private/Admin
router.delete('/customers/:id', protect, async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (customer) {
            // Optional: delete associated orders
            await Order.deleteMany({ customer: customer._id });
            await customer.deleteOne();
            res.json({ message: 'Customer and associated inquiries removed successfully' });
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
