const express = require('express');
const Mentor = require('../models/mentor.js');
const Course = require('../models/course.js');
const Mentee = require('../models/mentee.js');

const router = express.Router();

// Get Mentor Profile
router.get('/:mentorId', async (req, res) => {
    try {
        const mentor = await Mentor.findById(req.params.mentorId)
            .populate('mentees')
            .populate('courses');
        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }
        res.json(mentor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Mentor Profile
router.put('/:mentorId', async (req, res) => {
    const { name, role, expertise } = req.body;
    try {
        const updatedMentor = await Mentor.findByIdAndUpdate(
            req.params.mentorId,
            { name, role, expertise },
            { new: true }
        );
        if (!updatedMentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }
        res.json(updatedMentor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Mentor's Courses
router.get('/:mentorId/courses', async (req, res) => {
    try {
        const courses = await Course.find({ mentor: req.params.mentorId });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Mentor's Mentees
router.get('/:mentorId/mentees', async (req, res) => {
    try {
        const mentees = await Mentee.find({ assignedMentor: req.params.mentorId });
        res.json(mentees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
