const mongoose = require('mongoose');

const rulesSchema = new mongoose.Schema({
    event: { type: String },
    points: { type: String },
    subpoints: [String],
}, { timestamps: true });


module.exports = mongoose.model("Rule", rulesSchema);