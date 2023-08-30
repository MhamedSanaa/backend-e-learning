const dictationService = require('../services/dictation.service');
const ttsService = require('../services/tts.service');
const dictationActivity = require('../activities/dictationActivity')
var stringSimilarity = require("string-similarity");


exports.startDictation = (req, res) => {
    //const user = req.user;
    dictationService.updateQuestionIndex("OPAvpYNf9AQJ82qN4VYQAQnjYn72", 10);
    res.status(200).send('Data saved successfully.');
};

exports.resetDictation = async (req, res) => {
    //const user = req.user;
    await dictationService.resetScore("OPAvpYNf9AQJ82qN4VYQAQnjYn72")
    await dictationService.resetQuestionNumber("OPAvpYNf9AQJ82qN4VYQAQnjYn72")
    //dictationService.updateQuestionIndex(user.user_id, 0);
    res.status(200).send('Data saved successfully.');
};

exports.getDictation = async (req, res) => {

    //const user = req.user;
    console.log("user");

    var questionIndex = await dictationService.getQuestionIndex("OPAvpYNf9AQJ82qN4VYQAQnjYn72");
    await dictationService.updateQuestionIndex("OPAvpYNf9AQJ82qN4VYQAQnjYn72", questionIndex + 1 >= dictationActivity.questions.length ? 0 : questionIndex + 1)
    questionIndex = await dictationService.getQuestionIndex("OPAvpYNf9AQJ82qN4VYQAQnjYn72");
    await dictationService.updateQuestionNumber("OPAvpYNf9AQJ82qN4VYQAQnjYn72",await dictationService.getQuestionNumber("OPAvpYNf9AQJ82qN4VYQAQnjYn72") + 1)

    const text = dictationActivity.questions[questionIndex]
    const audioData = await ttsService.generateAudio(text);

    res.set('Content-Type', 'audio/mpeg');

    res.status(200).send(audioData);
};

exports.postResponse = async (req, res) => {
    //const user = req.user;
    const resp = req.body.text;
    const questionIndex = await dictationService.getQuestionIndex("OPAvpYNf9AQJ82qN4VYQAQnjYn72");
    var similarity = stringSimilarity.compareTwoStrings(resp?.toLowerCase().trim(), dictationActivity.questions[questionIndex]?.toLowerCase().trim(),);
    
    const questionNumber = await dictationService.getQuestionNumber("OPAvpYNf9AQJ82qN4VYQAQnjYn72");
    const finished = questionNumber > 3
    const passed = similarity > 0.95
    const text = dictationActivity.questions[questionIndex]
    if (passed) {
        await dictationService.updateScore("OPAvpYNf9AQJ82qN4VYQAQnjYn72")
    }
    const score = (await dictationService.getScore("OPAvpYNf9AQJ82qN4VYQAQnjYn72")).score

    if(finished){
        dictationService.resetScore("OPAvpYNf9AQJ82qN4VYQAQnjYn72")
    }
    res.status(200).send({ text: text, similarity: similarity, passed: passed, finished : finished, score : score });
    console.log({ text: text, similarity: similarity, passed: passed, finished : finished, score : score })
};