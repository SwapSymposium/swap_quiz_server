const express = require('express')
const router = express.Router();
const { quizSave, startRights, alreadyAttended, fetchParticipants, addUser, fetchQuestions, fetchRules, fetchTime } = require('../controllers/participantController')

router.post('/alreadyAttended', alreadyAttended);
router.post('/quizSave', quizSave);
router.post('/startRights', startRights);
router.post('/fetchParticipants', fetchParticipants);
router.post('/addUser', addUser);
router.post('/quizQustns', fetchQuestions);
router.post('/rules', fetchRules);
router.post('/fetchTime', fetchTime);

module.exports = router