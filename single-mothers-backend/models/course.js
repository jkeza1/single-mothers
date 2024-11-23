const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
    menteesEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mentee' }],
});

module.exports = mongoose.model('Course', CourseSchema);
