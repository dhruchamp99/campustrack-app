
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware'); // Student access is default if authenticated
const Holiday = require('../models/Holiday');

router.get('/dashboard', protect, async (req, res) => {
    // Return summary data
    // Upcoming holidays
    const holidays = await Holiday.find({ date: { $gte: new Date() } }).sort({ date: 1 }).limit(3);
    res.json({
        holidays
    });
});

module.exports = router;
