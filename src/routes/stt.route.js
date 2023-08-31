const express = require('express');
const router = express.Router();
const speechToTextController = require('../controllers/stt.controller');
const authMiddleware = require('../middlewares/auth');

const multer = require('multer');
const upload = multer();

router.post('/', authMiddleware.isAuthenticated, upload.single('audio'), speechToTextController.speech2Text);
module.exports = router;
