const express = require('express');
const Feature = require('../models/feature');
const router = express.Router();

// Get all features
router.get('/', async (req, res) => {
    try {
        const features = await Feature.find();
        res.json(features);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new feature
router.post('/', async (req, res) => {
    try {
        const newFeature = new Feature(req.body);
        const savedFeature = await newFeature.save();
        res.status(201).json(savedFeature);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
