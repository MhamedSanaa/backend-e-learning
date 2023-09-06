const dictationService = require('../services/dictation.service');
const ttsService = require('../services/tts.service');
const dictationActivity = require('../activities/dictationActivity')
var stringSimilarity = require("string-similarity");



exports.startDictation = (req, res) => {
    const userId = req.user.uid
    dictationService.updateQuestionIndex(userId, 10);
    res.status(200).send('Data saved successfully.');
};

exports.resetDictation = async (req, res) => {
    const userId = req.user.uid
    await dictationService.resetScore(userId)
    await dictationService.resetQuestionNumber(userId)
    //dictationService.updateQuestionIndex(user.user_id, 0);
    res.status(200).send('Data saved successfully.');
};

exports.getDictation = async (req, res) => {

    const userId = req.user.uid
    console.log("user");

    var questionIndex = await dictationService.getQuestionIndex(userId);
    await dictationService.updateQuestionIndex(userId, questionIndex + 1 >= dictationActivity.questions.length ? 0 : questionIndex + 1)
    questionIndex = await dictationService.getQuestionIndex(userId);
    await dictationService.updateQuestionNumber(userId,await dictationService.getQuestionNumber(userId) + 1)

    const text = dictationActivity.questions[questionIndex]
    const audioData = await ttsService.generateAudio(text);

    res.set('Content-Type', 'audio/mpeg');

    res.status(200).send(audioData);
};

exports.postResponse = async (req, res) => {
    const userId = req.user.uid
    const resp = req.body.text;
    const questionIndex = await dictationService.getQuestionIndex(userId);
    var similarity = stringSimilarity.compareTwoStrings(resp?.toLowerCase().trim(), dictationActivity.questions[questionIndex]?.toLowerCase().trim(),);
    
    const questionNumber = await dictationService.getQuestionNumber(userId);
    const finished = questionNumber > 4
    const passed = similarity > 0.99
    const text = dictationActivity.questions[questionIndex]
    if (passed) {
        await dictationService.updateScore(userId)
    }
    const score = (await dictationService.getScore(userId)).score

    if(finished){
        dictationService.resetScore(userId)
    }
    res.status(200).send({ text: text, similarity: similarity, passed: passed, finished : finished, score : score });
    console.log({ text: text, similarity: similarity, passed: passed, finished : finished, score : score })
};