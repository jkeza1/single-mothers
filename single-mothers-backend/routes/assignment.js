const express = require('express');
const Assignment = require('./models/assignment');
const router = express.Router();

// Get all assignments
router.get('/', async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new assignment
router.post('/', async (req, res) => {
    try {
        const assignment = new Assignment(req.body);
        await assignment.save();
        res.status(201).json(assignment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Mark assignment as completed
router.patch('/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (assignment) {
            assignment.completed = true;
            await assignment.save();
            res.json(assignment);
        } else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
