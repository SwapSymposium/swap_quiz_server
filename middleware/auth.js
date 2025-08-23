const jwt = require('jsonwebtoken');
const UserModel = require('../models/User')

const verifyToken = async (req, res, next) => {

    const { teamId } = req.body;
    // console.log(req.body)
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token found' })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) 
        // console.log(decoded)
        const userExists = await UserModel.findById(decoded.id)
        // console.log(userExists)
        if (!userExists) {
            console.log('User not found')
            return res.status(401).json({ message: 'User not found' })
        }
        if (userExists.teamId !== teamId) {
            console.log('User does not match')
            return res.status(401).json({ message: 'User does not match' });
        }
        // console.log('User Exists')
        return res.status(200).json({ status: 200, message: 'Token Valid' })  
    } catch (error) {
        console.error('Error in validating Token : ', error)
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = { verifyToken }