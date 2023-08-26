const express = require('express');
const router = express.Router();
const speechToTextController = require('../controllers/stt.controller');

const multer = require('multer');
const upload = multer();

router.post('/',upload.single('audio'), speechToTextController.speech2Text);
module.exports = router;
