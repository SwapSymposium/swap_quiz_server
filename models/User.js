const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    teamId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['SUPERADMIN', 'ADMIN', 'PARTICIPANTS'], required: true},
    event: { type: String },
    participants: [String],
    contactNo: { type: String },
    deptName: { type: String, required: true },
    clgName: { type: String, required: true },
    scores: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
