const mongoose = require('mongoose')

const settingSchema = new mongoose.Schema({
    event: { type: String },
    allowTest: { type: Boolean, default: false },
    time: { type: Number, default: 40 }
}, { timestamps: true })

module.exports = mongoose.model("Settings", settingSchema)