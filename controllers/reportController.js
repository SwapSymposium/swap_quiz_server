const UserModel = require('../models/User')

// --------------------------------------------------------------------------------------------------------------

const studentReport = async (req, res) => {

    const { event } = req.body;

    try {
        const allUsers = await UserModel.find({event, role: 'PARTICIPANTS'}).sort({ scores: -1, updatedAt: 1 });
        // console.log(allUsers)
        return res.status(200).json(allUsers)
    } catch (error) {
        console.error('Error in fetching Report : ', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// --------------------------------------------------------------------------------------------------------------

module.exports = { studentReport }