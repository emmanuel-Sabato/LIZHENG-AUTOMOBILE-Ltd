const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const Setting = require('../models/Setting');
const { protect } = require('../middleware/authMiddleware');

const upload = multer({ storage });

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
router.get('/', async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            // Create default settings if not exists
            settings = await Setting.create({
                slideshowImages: [
                    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80'
                ]
            });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update hero image
// @route   PUT /api/settings/hero
// @access  Private/Admin
router.put('/hero', protect, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        let settings = await Setting.findOne();
        if (!settings) settings = new Setting();

        settings.heroImage = req.file.path;
        settings.updatedAt = Date.now();
        await settings.save();

        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update about image
// @route   PUT /api/settings/about
// @access  Private/Admin
router.put('/about', protect, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        let settings = await Setting.findOne();
        if (!settings) settings = new Setting();

        settings.aboutImage = req.file.path;
        settings.updatedAt = Date.now();
        await settings.save();

        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add slideshow image
// @route   POST /api/settings/slideshow
// @access  Private/Admin
router.post('/slideshow', protect, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        let settings = await Setting.findOne();
        if (!settings) settings = new Setting();

        settings.slideshowImages.push(req.file.path);
        settings.updatedAt = Date.now();
        await settings.save();

        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Remove slideshow image
// @route   DELETE /api/settings/slideshow
// @access  Private/Admin
router.delete('/slideshow', protect, async (req, res) => {
    try {
        const { imageUrl } = req.body;
        if (!imageUrl) {
            return res.status(400).json({ message: 'Image URL is required' });
        }

        let settings = await Setting.findOne();
        if (!settings) return res.status(404).json({ message: 'Settings not found' });

        settings.slideshowImages = settings.slideshowImages.filter(img => img !== imageUrl);
        settings.updatedAt = Date.now();
        await settings.save();

        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update general site settings
// @route   PUT /api/settings
// @access  Private/Admin
router.put('/', protect, async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) settings = new Setting();

        // Update fields provided in req.body
        const updateFields = [
            'dealershipName', 'tagline', 'description', 'currency',
            'hoursWeekdays', 'hoursSaturday', 'whatsappNumber',
            'phoneNumber', 'emailAddress', 'address',
            'facebookUrl', 'instagramUrl', 'linkedinUrl', 'twitterUrl'
        ];

        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                settings[field] = req.body[field];
            }
        });

        settings.updatedAt = Date.now();
        await settings.save();

        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
