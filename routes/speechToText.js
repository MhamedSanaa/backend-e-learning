const router = require('express').Router();
const multer = require('multer');
const speechToTextController = require('../controllers/speechToText.controller');
const upload = multer({ dest: 'uploads/' });

router.post('/',upload.single('audio'), speechToTextController.speechToText);



module.exports = router;