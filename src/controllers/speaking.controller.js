const speakingService = require('../services/speaking.service');
const ttsService = require('../services/tts.service');
const sttService = require('../services/stt.service');

const speakingActivity = require('../activities/speakingActivity')
var stringSimilarity = require("string-similarity");


exports.startSpeaking = (req, res) => {
    //const user = req.user;
    speakingService.updateQuestionIndex("OPAvpYNf9AQJ82qN4VYQAQnjYn72", 10);
    res.status(200).send('Data saved successfully.');
};

exports.resetSpeaking = async (req, res) => {
    //const user = req.user;
    await speakingService.resetScore("OPAvpYNf9AQJ82qN4VYQAQnjYn72")
    await speakingService.resetQuestionNumber("OPAvpYNf9AQJ82qN4VYQAQnjYn72")
    //speakingService.updateQuestionIndex(user.user_id, 0);
    res.status(200).send('Data saved successfully.');
};

exports.getSpeaking = async (req, res) => {

    //const user = req.user;

    var questionIndex = await speakingService.getQuestionIndex("OPAvpYNf9AQJ82qN4VYQAQnjYn72");
    await speakingService.updateQuestionIndex("OPAvpYNf9AQJ82qN4VYQAQnjYn72", questionIndex + 1 >= speakingActivity.questions.length ? 0 : questionIndex + 1)
    questionIndex = await speakingService.getQuestionIndex("OPAvpYNf9AQJ82qN4VYQAQnjYn72");
    await speakingService.updateQuestionNumber("OPAvpYNf9AQJ82qN4VYQAQnjYn72", await speakingService.getQuestionNumber("OPAvpYNf9AQJ82qN4VYQAQnjYn72") + 1)

    const text = speakingActivity.questions[questionIndex]
    res.status(200).send({ text: text });
};

exports.postResponse = async (req, res) => {
    //const user = req.user;
    console.log(req.file)
    try {
        const inputBuffer = req.file.buffer;
        const convertedAudio = await sttService.convertAudio(inputBuffer);
        const recognitionResult = await sttService.recognizeSpeech(convertedAudio);
        const processedText = sttService.processRecognitionResult(recognitionResult);
        
        const questionIndex = await speakingService.getQuestionIndex("OPAvpYNf9AQJ82qN4VYQAQnjYn72");

        console.log(processedText)
        // similarity
        var similarity = stringSimilarity.compareTwoStrings(processedText?.toLowerCase().trim(), speakingActivity.questions[questionIndex]?.toLowerCase().trim(),);

        //
        const questionNumber = await speakingService.getQuestionNumber("OPAvpYNf9AQJ82qN4VYQAQnjYn72");
        const finished = questionNumber > 9
        const passed = similarity > 0.95
        const text = speakingActivity.questions[questionIndex]
        if (passed) {
            await speakingService.updateScore("OPAvpYNf9AQJ82qN4VYQAQnjYn72")
        }
        const score = (await speakingService.getScore("OPAvpYNf9AQJ82qN4VYQAQnjYn72")).score

        if (finished) {
            await speakingService.resetScore("OPAvpYNf9AQJ82qN4VYQAQnjYn72")
        }
        res.status(200).send({ text: text, similarity: similarity, passed: passed, finished: finished, score: score });

    } catch (error) {
        console.error("Error performing speech-to-text with Wit.ai:", error);
        res.status(500).send("Error performing speech-to-text with Wit.ai");
    }

};