// Mock feedback storage
let feedbacks = [];

// Submit feedback
exports.submitFeedback = (req, res) => {
    const { feedback } = req.body;
    feedbacks.push({ id: Date.now(), feedback });
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
};
