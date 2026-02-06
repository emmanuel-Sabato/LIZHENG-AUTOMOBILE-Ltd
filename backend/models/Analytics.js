const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true
    },
    deviceType: {
        type: String,
        required: true,
        enum: ['Mobile', 'Desktop', 'Tablet']
    },
    ip: {
        type: String
    },
    userAgent: {
        type: String
    },
    country: {
        type: String,
        default: 'Unknown'
    }
}, {
    timestamps: true
});

// Index for faster queries on common analytics views
analyticsSchema.index({ createdAt: -1 });
analyticsSchema.index({ page: 1 });
analyticsSchema.index({ deviceType: 1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
