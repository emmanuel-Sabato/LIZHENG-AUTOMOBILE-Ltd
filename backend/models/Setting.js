const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
    heroImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80'
    },
    aboutImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80'
    },
    slideshowImages: [{
        type: String
    }],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Setting', SettingSchema);
