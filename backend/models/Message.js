const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Please provide your phone number']
    },
    subject: {
        type: String,
        required: [true, 'Please provide a subject']
    },
    message: {
        type: String,
        required: [true, 'Please provide your message']
    },
    status: {
        type: String,
        enum: ['Unread', 'Read'],
        default: 'Unread'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
