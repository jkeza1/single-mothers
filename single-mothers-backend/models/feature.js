const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
});

module.exports = mongoose.model('Feature', featureSchema);
