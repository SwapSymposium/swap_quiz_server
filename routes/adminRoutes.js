const express = require('express')
const router = express.Router();
const { testAccessSave, testAccessFetch, imageQuestion, imageUpload, upload } = require('../controllers/adminControlller')

router.post('/testAccessFetch', testAccessFetch);
router.put('/testAccessSave', testAccessSave);
router.post('/imageQuestion', imageQuestion);
router.post('/imageUpload', upload, imageUpload);

module.exports = router