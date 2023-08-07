const express = require('express');
const router = express.Router();
const speechToTextController = require('../controllers/stt.controller');

router.post('/', speechToTextController.speech2Text);
module.exports = router;
