const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    transmission: {
        type: String,
        required: true,
        enum: ['Automatic', 'Manual']
    },
    fuelType: {
        type: String,
        required: true,
        enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric']
    },
    mileage: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    description: {
        type: String
    },
    featured: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'Available',
        enum: ['Available', 'Sold', 'Reserved']
    },
    features: {
        type: [String],
        default: []
    },
    ratings: [{
        rating: { type: Number, required: true },
        comment: { type: String },
        userName: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
