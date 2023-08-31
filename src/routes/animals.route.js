const express = require('express');
const animalsController = require('../controllers/animals.controller');
const authMiddleware = require('../middlewares/auth');
const multer = require('multer');
const upload = multer();

const router = express.Router();

router.get('/start',authMiddleware.isAuthenticated, animalsController.startAnimals);
router.get('/get',authMiddleware.isAuthenticated, animalsController.getAnimals);
router.get('/reset',authMiddleware.isAuthenticated, animalsController.resetAnimals);
router.post('/respond',authMiddleware.isAuthenticated, upload.single('audio'), animalsController.postResponse);

module.exports = router;