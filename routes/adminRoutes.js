const express = require('express')
const router = express.Router();
const { testAccessSave, testAccessFetch, imageQuestion, imageUpload, upload,getEvents,addEvent } = require('../controllers/adminControlller')

router.post('/testAccessFetch', testAccessFetch);
router.put('/testAccessSave', testAccessSave);
router.post('/imageQuestion', imageQuestion);
router.post('/imageUpload', upload, imageUpload);
router.post('/getEvents', getEvents);
router.post('/addEvents', addEvent);

module.exports = router