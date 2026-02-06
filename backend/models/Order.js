const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    status: {
        type: String,
        default: 'new',
        enum: ['new', 'in_progress', 'completed', 'cancelled']
    },
    source: {
        type: String,
        default: 'website'
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
