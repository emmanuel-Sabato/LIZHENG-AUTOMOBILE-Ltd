const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
    // Visuals
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

    // General Info
    dealershipName: { type: String, default: 'LIZHENG AUTOMOBILE Ltd' },
    tagline: { type: String, default: 'Quality Cars. Trusted Deals.' },
    description: { type: String, default: "Rwanda's premier destination for quality pre-owned vehicles. We offer a handpicked selection of premium cars at competitive prices." },
    currency: { type: String, default: 'USD' },

    // Business Hours
    hoursWeekdays: { type: String, default: '8:00 AM - 6:00 PM' },
    hoursSaturday: { type: String, default: '9:00 AM - 4:00 PM' },

    // Contact Info
    whatsappNumber: { type: String, default: '+250 780 000 000' },
    phoneNumber: { type: String, default: '+250 788 000 000' },
    emailAddress: { type: String, default: 'info@lizhengauto.rw' },
    address: { type: String, default: 'KG 123 Street, Kimihurura, Kigali, Rwanda' },

    // Social Links
    facebookUrl: { type: String, default: 'https://facebook.com/lizhengauto' },
    instagramUrl: { type: String, default: 'https://instagram.com/lizhengauto' },
    linkedinUrl: { type: String, default: '' },
    twitterUrl: { type: String, default: '' },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Setting', SettingSchema);
