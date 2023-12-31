const express = require('express');
const hangmanController = require('../controllers/hangman.controller');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/create',authMiddleware.isAuthenticated, hangmanController.createRoom);
router.post('/join',authMiddleware.isAuthenticated, hangmanController.joinRoom);
router.post('/send',authMiddleware.isAuthenticated, hangmanController.sendResponse);

module.exports = router;