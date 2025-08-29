const UserModel = require('../models/User');
const AnswerModel = require('../models/Answers');
const SettingModel = require('../models/Settings');
const QuestionModel = require('../models/Questions');
const RulesModel = require('../models/Rules');

// --------------------------------------------------------------------------------------------------------------

// Save Answers of Quiz

const quizSave = async (req, res) => {

    const { teamId, scores, answers, event } = req.body;
    // console.log(req.body)

    try {
        const updated = await AnswerModel.findOneAndUpdate(
            { teamId: teamId, event },
            { scores: scores, answers },
            { new: true, upsert: true }
        )

        const inUser = await UserModel.findOneAndUpdate({ teamId, event }, { scores }, { new: true })

        return res.status(200).json({
            status: 200,
            message: 'Quiz saved successfully',
            scores: updated.scores
        })

    } catch (error) {
        console.error('Error in Saving Quiz : ', error.message);
        return res.status(500).json({ message: 'Error saving quiz', error: error.message });
    }
}

// --------------------------------------------------------------------------------------------------------------

// Fetch Permission to allow Test

const startRights = async (req, res) => {

    const { event } = req.body;

    try {

        const setting = await SettingModel.findOne({ event }, "allowTest")
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

    const { teamId } = req.body;

    try {
        const alreadyExists = await AnswerModel.findOne({ teamId }).select("_id");
        // console.log(alreadyExists)
        if (alreadyExists) {
            return res.status(200).json({ status: 200, message: "Permitted to start test", attended: true });
        }
    } catch (error) {
        console.error('Error in fetch permission for quiz for students : ', error);
        return res.status(500).json({ message: 'Error in permission for allowing quiz', error: error.message });
    }
}

// --------------------------------------------------------------------------------------------------------------

// Fetch Participants of Admin

const fetchParticipants = async (req, res) => {

    const { event } = req.body

    try {
        const allUsers = await UserModel.find({ event, role: 'PARTICIPANTS' });
        // console.log(allUsers)
        return res.status(200).json(allUsers)
    } catch (error) {
        console.error('Error in fetching Report : ', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// --------------------------------------------------------------------------------------------------------------

// Fetch Question Time

const fetchTime = async (req, res) => {

    const { event } = req.body;
    // console.log(req.body)

    try {
        const time = await SettingModel.findOne({ event });
        const timeLimit = time.time
        // console.log(timeLimit)
        return res.status(200).json({ timeLimit })
    } catch (error) {
        console.error('Error in fetching Report : ', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// --------------------------------------------------------------------------------------------------------------

// Add User

const addUser = async (req, res) => {

    const { teamId, password, clgName, deptName, contactNo, participants, role, event, swapId } = req.body;
    // console.log(req.body)

    try {
        const userExists = await UserModel.findOne({ teamId });
        if (userExists) return res.status(401).json({ message: 'StaffId already Exist' })
        const newUser = new UserModel({ teamId, password, clgName, deptName, participants, role, swapId, event, contactNo });
        await newUser.save();
        return res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

// --------------------------------------------------------------------------------------------------------------

// Fetch Questions for Quiz

const fetchQuestions = async (req, res) => {

    const { event } = req.body;

    try {
        const questions = await QuestionModel.find({ event }).sort({ questionNo: 1 });
        // console.log(questions)
        return res.status(200).json({ success: true, data: questions });
    } catch (error) {
        console.error('Error in Fetching Questions : ');
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// --------------------------------------------------------------------------------------------------------------

// Fetch Rules for Quiz

const fetchRules = async (req, res) => {

    const { event } = req.body
    // console.log(req.body)

    try {
        const allRules = await RulesModel.find({ event });
        // console.log(allRules)
        return res.status(200).json(allRules)
    } catch (error) {
        console.error('Error in fetching Rules : ', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// --------------------------------------------------------------------------------------------------------------

module.exports = { quizSave, startRights, alreadyAttended, fetchParticipants, addUser, fetchQuestions, fetchTime, fetchRules }