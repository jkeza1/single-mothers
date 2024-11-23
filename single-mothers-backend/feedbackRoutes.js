const express = require('express');
const Feedback = require('./models/feedback');
const router = express.Router();

// Post feedback
router.post('/', async (req, res) => {
    try {
        const feedback = new Feedback(req.body);
        await feedback.save();
        res.status(201).json(feedback);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
