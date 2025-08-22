const mongoose = require('mongoose');

const answersSchema = new mongoose.Schema({
    event: { type: String, required: true },
    questionNo: { type: Number, required: true },
    question: { type: String, required: true },
    questionType: { type: String },
    options: [String],
    answer: { type: String },
    mark: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model("Question", answersSchema);