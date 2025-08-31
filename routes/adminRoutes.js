const express = require('express')
const router = express.Router();
const { testAccessSave, testAccessFetch, imageQuestion, imageUpload, upload, getEvents, dataDeletion, fetchEvents, addEvent, editUser, deleteUser } = require('../controllers/adminControlller')

router.post('/testAccessFetch', testAccessFetch);
router.put('/testAccessSave', testAccessSave);
router.post('/imageQuestion', imageQuestion);
router.post('/imageUpload', upload, imageUpload);
router.post('/getEvents', getEvents);
router.post('/addEvents', addEvent);
router.put('/editUser', editUser);
router.delete('/deleteUser', deleteUser);
router.delete('/dataDeletion', dataDeletion);
router.post('/fetchEvents', fetchEvents);

module.exports = router