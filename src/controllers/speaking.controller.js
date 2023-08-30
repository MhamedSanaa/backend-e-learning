const speakingService = require('../services/speaking.service');
const ttsService = require('../services/tts.service');
const sttService = require('../services/stt.service');
const soundex = require('soundex');


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
    try {
        const inputBuffer = req.file.buffer;
        const convertedAudio = await sttService.convertAudio(inputBuffer);
        const recognitionResult = await sttService.recognizeSpeech(convertedAudio);
        const processedText = sttService.processRecognitionResult(recognitionResult);

        const questionIndex = await speakingService.getQuestionIndex("OPAvpYNf9AQJ82qN4VYQAQnjYn72");

        console.log("Response : " + processedText)
        // similarity
        var textSim = stringSimilarity.compareTwoStrings(processedText?.toLowerCase().trim(), speakingActivity.questions[questionIndex]?.toLowerCase().trim(),);



        const string1 = processedText?.toLowerCase().trim();
        const string2 = speakingActivity.questions[questionIndex]?.toLowerCase().trim();


        const soundex1 = soundex(string1)
        const soundex2 = soundex(string2)

        const soundSim = stringSimilarity.compareTwoStrings(soundex1?.toLowerCase().trim(), soundex2?.toLowerCase().trim())

        const similarity = Math.max(soundSim, textSim)
        console.log("Sim : ",soundSim,textSim)
        console.log(similarity)

        const questionNumber = await speakingService.getQuestionNumber("OPAvpYNf9AQJ82qN4VYQAQnjYn72");
        const finished = questionNumber > 2
        const passed = similarity > 0.66
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