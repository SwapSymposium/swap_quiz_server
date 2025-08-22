const express = require('express')
const router = express.Router();
const { quizSave, startRights, alreadyAttended, fetchParticipants, addUser } = require('../controllers/participantController')

router.post('/alreadyAttended', alreadyAttended);
router.post('/quizSave', quizSave);
router.post('/startRights', startRights);
router.post('/fetchParticipants', fetchParticipants);
router.post('/addUser', addUser);

module.exports = router