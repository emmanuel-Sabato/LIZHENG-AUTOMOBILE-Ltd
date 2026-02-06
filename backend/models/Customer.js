const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    whatsapp: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true,
        enum: ['Email', 'Call', 'Whatsapp']
    },
    status: {
        type: String,
        default: 'Potential',
        enum: ['Potential', 'Active', 'Converted']
    }
}, {
    timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
