const express = require('express');
const router = express.Router();
const textToSpeechController = require('../controllers/tts.controller');
const authMiddleware = require('../middlewares/auth');

router.post('/', authMiddleware.isAuthenticated, textToSpeechController.text2Speech);
module.exports = router;