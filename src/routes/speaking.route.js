const express = require('express');
const speakingController = require('../controllers/speaking.controller');
const authMiddleware = require('../middlewares/auth');
const multer = require('multer');
const upload = multer();

const router = express.Router();

router.get('/start', speakingController.startSpeaking);
router.get('/get', speakingController.getSpeaking);
router.get('/reset', speakingController.resetSpeaking);
router.post('/respond',upload.single('audio'), speakingController.postResponse);

module.exports = router;