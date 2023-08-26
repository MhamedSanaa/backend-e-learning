const fs = require('fs');
const sttService = require('../services/stt.service');

exports.speech2Text = async (req, res) => {
  try {
    const inputBuffer = req.file.buffer;

    const convertedAudio = await sttService.convertAudio(inputBuffer);
    const recognitionResult = await sttService.recognizeSpeech(convertedAudio);
    const processedText = sttService.processRecognitionResult(recognitionResult);

    console.log("stt result : ",processedText)
    res.status(200).json({ "text": processedText });
 
  } catch (error) {
    console.error("Error performing speech-to-text with Wit.ai:", error);
    res.status(500).send("Error performing speech-to-text with Wit.ai");
  }
};
