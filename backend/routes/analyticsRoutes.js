const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const { protect } = require('../middleware/authMiddleware');

// @desc    Record a new page view
// @route   POST /api/analytics
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { page, deviceType, country } = req.body;

        const view = await Analytics.create({
            page,
            deviceType,
            country,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(201).json(view);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get analytics stats
// @route   GET /api/analytics/stats
// @access  Private/Admin
router.get('/stats', protect, async (req, res) => {
    try {
        // 1. Total Views
        const totalViews = await Analytics.countDocuments();

        // 2. Unique Visitors (estimated by IP)
        const uniqueVisitors = await Analytics.distinct('ip').then(ips => ips.length);

        // 3. Device Breakdown
        const deviceBreakdown = await Analytics.aggregate([
            {
                $group: {
                    _id: '$deviceType',
                    count: { $sum: 1 }
                }
            }
        ]);

        // 4. Views per Day (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const viewsPerDay = await Analytics.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            totalViews,
            uniqueVisitors,
            deviceBreakdown: deviceBreakdown.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {}),
            viewsPerDay
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
