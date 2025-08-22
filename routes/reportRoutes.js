const express = require('express')
const router = express.Router();
const { studentReport } = require('../controllers/reportController')

router.post('/student', studentReport);

module.exports = router