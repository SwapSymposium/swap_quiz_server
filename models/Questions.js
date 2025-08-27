const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    event: { type: String, required: true },
    questionNo: { type: Number, required: true },
    question: { type: String, required: true },
    questionType: { type: String, enum: ["text", "image"], required: true },
    options: [{ type: String }],
    answer: { type: String, default: null }, 
    mark: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);
