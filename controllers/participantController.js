const UserModel = require('../models/User');
const AnswerModel = require('../models/Answers');
const SettingModel = require('../models/Settings');
const QuestionModel = require('../models/Questions');

// --------------------------------------------------------------------------------------------------------------

// Save Answers of Quiz

const quizSave = async (req, res) => {

    const { userId, scores, answers } = req.body;

    try {
        await UserModel.findOneAndUpdate({ userId }, { scores }, { new: true });
        await AnswerModel.findOneAndUpdate({ userId }, { answers }, { new: true, upsert: true });
        return res.status(200).json({ status: 200, message: 'Quiz saved successfully', score: scores });
    } catch (error) {
        console.error('Error in Saving Quiz : ', error.message);
        return res.status(500).json({ message: 'Error saving quiz', error: error.message });
    }
}

// --------------------------------------------------------------------------------------------------------------

// Fetch Permission to allow Test

const startRights = async (req, res) => {

    const { userId } = req.body;

    try {

        const setting = await SettingModel.findOne({}, "allowTest")
        if (!setting.allowTest) { return res.status(403).json({ status: 403, message: "Not permitted to start test", attended: false }) }
        return res.status(200).json({ status: 200, message: "Permitted to start test" });

    } catch (error) {
        console.error('Error in fetch permission for quiz for students : ', error);
        return res.status(500).json({ message: 'Error in permission for allowing quiz', error: error.message });
    }
}

// --------------------------------------------------------------------------------------------------------------

// Fetch Permission to allow Test

const alreadyAttended = async (req, res) => {

    const { userId } = req.body;

    try {
        const alreadyExists = await AnswerModel.findOne({ userId }).select("_id");
        if (alreadyExists) {
            return res.status(200).json({ status: 200, message: "Permitted to start test", attended: true });
        }
    } catch (error) {
        console.error('Error in fetch permission for quiz for students : ', error);
        return res.status(500).json({ message: 'Error in permission for allowing quiz', error: error.message });
    }
}

// --------------------------------------------------------------------------------------------------------------

const fetchParticipants = async (req, res) => {

    try {
        const allUsers = await UserModel.find();
        return res.status(200).json(allUsers)
    } catch (error) {
        console.error('Error in fetching Report : ', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// --------------------------------------------------------------------------------------------------------------

// Add User

const addUser = async (req, res) => {

    const { userId, password, clgName, deptName, memberName1, memberName2, contactNo } = req.body;

    try {
        const userExists = await UserModel.findOne({ userId });
        if (userExists) return res.status(401).json({ message: 'StaffId already Exist' })
        const newUser = new UserModel({ userId, password, clgName, deptName, memberName1, memberName2, contactNo });
        await newUser.save();
        return res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

// --------------------------------------------------------------------------------------------------------------

module.exports = { quizSave, startRights, alreadyAttended, fetchParticipants, addUser }