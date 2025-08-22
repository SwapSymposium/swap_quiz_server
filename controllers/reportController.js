const UserModel = require('../models/User')

// --------------------------------------------------------------------------------------------------------------

const studentReport = async (req, res) => {

    try {
        const allUsers = await UserModel.find().sort({ scores: -1, updatedAt: 1 });
        return res.status(200).json(allUsers)
    } catch (error) {
        console.error('Error in fetching Report : ', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// --------------------------------------------------------------------------------------------------------------

module.exports = { studentReport }