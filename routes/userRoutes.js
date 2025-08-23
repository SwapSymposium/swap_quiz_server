const express = require('express')
const router = express.Router();
const { loginUser } = require('../controllers/userController')
const { verifyToken } = require('../middleware/auth')

router.post('/login', loginUser);
router.post('/verifyToken', verifyToken)

module.exports = router