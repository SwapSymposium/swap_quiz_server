const mongoose = require('mongoose');

const answersSchema = new mongoose.Schema({
    teamId: { type: String, required: true, unique: true },
    event: { type: String },
    score: { type: Number },
    answers: { type: Map, of: String }
}, { timestamps: true });

module.exports = mongoose.model("Answer", answersSchema);