const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/profile', authMiddleware.isAuthenticated, userController.getProfile);

module.exports = router;