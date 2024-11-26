const express = require('express');
const router = express.Router();
const { submitFeedback } = require('../controllers/feedbackcontroller');

// POST feedback
router.post('/', submitFeedback);

module.exports = router;
