const express = require('express');
const router = express.Router();
const textToSpeechController = require('../controllers/tts.controller');

router.post('/', textToSpeechController.text2Speech);
module.exports = router;
