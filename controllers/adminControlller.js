const UserModel = require('../models/User')
const SettingModel = require('../models/Settings')
const QuestionModel = require('../models/Questions')
const AnswerModel = require('../models/Answers')
const RulesModel = require('../models/Rules')
const { response } = require('express')
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// --------------------------------------------------------------------------------------------------------------

// Fetch Status of Allow Test in Admin Setting Menu

const testAccessFetch = async (req, res) => {

    const { event } = req.body;

    try {
        const testPermission = await SettingModel.findOne({ event })
        // console.log(testPermission)
        return res.status(200).json({ status: 200, allowTest: testPermission.allowTest, time: testPermission.time })
    } catch (error) {
        console.error('Error in fetching status access : ', error);
        return res.status(500).json({ message: 'Error in fetching status access' });
    }

}

// --------------------------------------------------------------------------------------------------------------

// Test Access Save in Admin Setting Menu

const testAccessSave = async (req, res) => {

    const { allowTest, event, time } = req.body;
    // console.log(req.body)

    try {
        await SettingModel.findOneAndUpdate({ event }, { allowTest, time }, { new: true })
        return res.status(200).json({ status: 200, message: 'Settings Saved Sucessfully' })
    } catch (error) {
        console.error('Error in saving test access : ', error);
        return res.status(500).json({ message: 'Error in saving test access' });
    }
}

// --------------------------------------------------------------------------------------------------------------

// Fetch Image Type Questions 

const imageQuestion = async (req, res) => {

    const { eventName } = req.body;

    try {
        const questions = await QuestionModel.find({ event: eventName, questionType: "image", answer: null })
        return res.status(200).json({
            success: true, data: questions,
            message: questions.length > 0 ? "Image questions fetched successfully" : "No pending image questions found"
        })
    } catch (error) {
        console.error("Error fetching image questions : ", error);
        return res.status(500).json({ success: false, data: [], message: "Internal server error" })
    }
}

// --------------------------------------------------------------------------------------------------------------

// Upload Multer 

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) { fs.mkdirSync(uploadDir) }

const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, uploadDir) },
    filename: function (req, file, cb) { cb(null, Date.now() + "-" + file.originalname) },
})

const upload = multer({ storage }).array("options", 4);

// --------------------------------------------------------------------------------------------------------------

// Controller Logic

const imageUpload = async (req, res) => {

    try {

        const { event, questionNo, question, answer } = req.body;
        if (!event || !questionNo || !question || !answer) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const options = req.files.map((file) => file.filename);
        if (options.length !== 4) {
            return res.status(400).json({ message: "Exactly 4 options must be uploaded" });
        }
        const ansIndex = parseInt(answer) - 1;
        if (ansIndex < 0 || ansIndex >= options.length) {
            return res.status(400).json({ message: "Answer does not match uploaded options" });
        }

        const ansFile = options[ansIndex];
        const questionDoc = await QuestionModel.findOneAndUpdate(
            { event, questionNo },
            { $set: { options, answer: ansFile } },
            { new: true, upsert: true }
        )
        res.status(200).json({ message: "Question uploaded successfully", data: questionDoc })

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

// --------------------------------------------------------------------------------------------------------------

// Get Admin Id for SuperAdmin Panal

const getEvents = async (req, res) => {

    try {
        const eventsData = await UserModel.find({ role: "ADMIN" })
        return res.json({ success: true, events: eventsData });
    } catch (err) {
        console.error("Backend error while fetching events : ", err);
        return res.status(500).json({ success: false, message: "Failed to fetch events" });
    }
}

// --------------------------------------------------------------------------------------------------------------

// Add New Event

const addEvent = async (req, res) => {

    try {

        const { teamId, password, eventName, contactNo, deptName, clgName } = req.body;
        // console.log(req.body)

        if (!teamId || !password || !eventName) {
            return res.status(400).json({
                success: false, message: "teamId, password, and event name are required"
            })
        }

        const existingEvent = await UserModel.findOne({ role: "ADMIN", event: eventName });
        if (existingEvent) {
            return res.status(400).json({ success: false, message: "Event already exists" });
        }

        const newEvent = new UserModel({
            teamId, password, role: "ADMIN", event: eventName, swapId: 'JMC',
            participants: [], contactNo: contactNo || "1234567890",
            deptName: deptName || "JMC", clgName: clgName || "JMC", scores: 0
        })

        const eventSetting = new SettingModel({
            event: eventName, allowTest: false, time: 45,
        })

        await newEvent.save(); await eventSetting.save();

        return res.status(201).json({ success: true, message: "Event added successfully", data: newEvent })

    } catch (error) {
        console.error("Error in addEvent:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

// --------------------------------------------------------------------------------------------------------------

// Edit Event

const editUser = async (req, res) => {

    const { teamId, event, password, contactNo } = req.body;

    try {
        const user = await UserModel.findOneAndUpdate(
            { teamId }, { event, password, contactNo }, { new: true }
        )
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User updated successfully' })
    } catch (error) {
        console.error("Error in addEvent:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

// --------------------------------------------------------------------------------------------------------------

// Delete Event

const deleteUser = async (req, res) => {

    const { event } = req.body;

    try {
        const users = await UserModel.deleteMany({ event });
        const settings = await SettingModel.deleteMany({ event });
        const questions = await QuestionModel.deleteMany({ event });
        const answers = await AnswerModel.deleteMany({ event });
        const rules = await RulesModel.deleteMany({ event });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting user' });
    }
}

// --------------------------------------------------------------------------------------------------------------

// Fetch Participants of Admin

const fetchEvents = async (req, res) => {

    try {
        const allEvents = await UserModel.find({ role: 'ADMIN' });
        // console.log(allEvents)
        return res.status(200).json(allEvents)
    } catch (error) {
        console.error('Error in fetching Report : ', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// --------------------------------------------------------------------------------------------------------------

// Delete Event

const dataDeletion = async (req, res) => {

    const { event, tableName } = req.body;
    // console.log(req.body)

    try {
        let result;
        if (tableName === 'Participants') { result = await UserModel.deleteMany({ event, role: 'PARTICIPANTS' }) }
        else if (tableName === 'Rules') { result = await RulesModel.deleteMany({ event }) }
        else if (tableName === 'Answers') {
            result = await AnswerModel.deleteMany({ event });
            await UserModel.updateMany({ event, role: 'PARTICIPANTS' }, { $set: { scores: 0 } })
        }
        else if (tableName === 'Questions') { result = await QuestionModel.deleteMany({ event }) }
        else { return res.status(400).json({ message: "Invalid table name" }) }
        res.status(200).json({ message: `${tableName} deleted successfully`, deletedCount: result.deletedCount });

    } catch (error) {
        console.error('Error in Deleting Data : ', error);
        res.status(500).json({ message: 'Error deleting data' });
    }
}

// --------------------------------------------------------------------------------------------------------------

module.exports = { testAccessSave, dataDeletion, testAccessFetch, fetchEvents, imageQuestion, deleteUser, imageUpload, upload, editUser, getEvents, addEvent }