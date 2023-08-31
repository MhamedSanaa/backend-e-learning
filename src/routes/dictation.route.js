const express = require('express');
const dictationController = require('../controllers/dictation.controller');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/start',authMiddleware.isAuthenticated, dictationController.startDictation);
router.get('/get',authMiddleware.isAuthenticated, dictationController.getDictation);
router.get('/reset',authMiddleware.isAuthenticated, dictationController.resetDictation);
router.post('/respond',authMiddleware.isAuthenticated, dictationController.postResponse);

module.exports = router;