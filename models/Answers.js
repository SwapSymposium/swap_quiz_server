const mongoose = require('mongoose');

const answersSchema = new mongoose.Schema({
    teamId: { type: String, required: true, unique: true },
    event: { type: String },
    score: { type: Number },
    answers: [
        { questionNo: { type: Number }, answer: { type: String } }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Answer", answersSchema);