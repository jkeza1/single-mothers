const mongoose = require('mongoose');

const MenteeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    progress: { type: String, default: 'Not Started' },
    assignedMentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
});

module.exports = mongoose.model('Mentee', MenteeSchema);
