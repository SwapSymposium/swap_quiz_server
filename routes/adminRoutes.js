const express = require('express')
const router = express.Router();
const { testAccessSave, testAccessFetch } = require('../controllers/adminControlller')

router.post('/testAccessFetch', testAccessFetch);
router.put('/testAccessSave', testAccessSave);

module.exports = router