const express = require('express');
const animalsController = require('../controllers/animals.controller');
const authMiddleware = require('../middlewares/auth');
const multer = require('multer');
const upload = multer();

const router = express.Router();

router.get('/start', animalsController.startAnimals);
router.get('/get', animalsController.getAnimals);
router.get('/reset', animalsController.resetAnimals);
router.post('/respond',upload.single('audio'), animalsController.postResponse);

module.exports = router;