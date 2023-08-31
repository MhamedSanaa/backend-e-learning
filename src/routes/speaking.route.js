const express = require('express');
const speakingController = require('../controllers/speaking.controller');
const authMiddleware = require('../middlewares/auth');
const multer = require('multer');
const upload = multer();

const router = express.Router();

router.get('/start',authMiddleware.isAuthenticated, speakingController.startSpeaking);
router.get('/get',authMiddleware.isAuthenticated, speakingController.getSpeaking);
router.get('/reset',authMiddleware.isAuthenticated, speakingController.resetSpeaking);
router.post('/respond',authMiddleware.isAuthenticated, upload.single('audio'), speakingController.postResponse);

module.exports = router;