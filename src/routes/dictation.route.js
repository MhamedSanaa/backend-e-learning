const express = require('express');
const dictationController = require('../controllers/dictation.controller');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/start', dictationController.startDictation);
router.get('/get', dictationController.getDictation);
router.get('/reset', dictationController.resetDictation);
router.post('/respond', dictationController.postResponse);

module.exports = router;