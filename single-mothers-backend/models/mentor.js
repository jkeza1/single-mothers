const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'Mentor' },
    expertise: { type: String, required: true },
    mentees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mentee' }],
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

module.exports = mongoose.model('Mentor', MentorSchema);
