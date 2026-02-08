const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');

// Middleware to protect admin routes
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.admin = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// @desc    Submit a new message
// @route   POST /api/messages
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        const newMessage = await Message.create({
            name,
            email,
            phone,
            subject,
            message
        });
        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @desc    Get unread messages count
// @route   GET /api/messages/unread-count
// @access  Private/Admin
router.get('/unread-count', protect, async (req, res) => {
    try {
        const count = await Message.countDocuments({ status: 'Unread' });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private/Admin
router.put('/:id/read', protect, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (message) {
            message.status = 'Read';
            await message.save();
            res.json({ success: true, data: message });
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (message) {
            await message.deleteOne();
            res.json({ success: true, message: 'Message removed' });
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
