const jwt = require('jsonwebtoken');
const SALT_ROUNDS = 10;

// --------------------------------------------------------------------------------------------------------------

const UserModel = require('../models/User')

// --------------------------------------------------------------------------------------------------------------

const loginUser = async (req, res) => {

    const { teamId, password } = req.body;

    try {
        const userExists = await UserModel.findOne({ teamId });
        // console.log(userExists)
        if (!userExists) { return res.status(401).json({ message: 'User not found.' }) };
        if (password !== userExists.password) { return res.status(401).json({ message: 'Password is Invalid.' }) };
        const token = jwt.sign({ id: userExists._id, teamId: userExists.teamId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
        // console.log(token)
        return res.status(200).json({ status: 200, token, user: { event: userExists.event, role: userExists.role } });
    } catch (error) {
        console.error('Error in Loggin User : ', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// --------------------------------------------------------------------------------------------------------------

module.exports = { loginUser }