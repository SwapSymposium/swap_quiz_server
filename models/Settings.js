const mongoose = require('mongoose')

const settingSchema = new mongoose.Schema({
    allowTest: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model("Settings", settingSchema)