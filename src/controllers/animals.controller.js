const animalsService = require('../services/animals.service');
const ttsService = require('../services/tts.service');
const sttService = require('../services/stt.service');
const soundex = require('soundex');
const fs = require('fs');
const path = require('path');


const animalsActivity = require('../activities/animalsActivity')
var stringSimilarity = require("string-similarity");


exports.startAnimals = (req, res) => {
    //const user = req.user;
    animalsService.updateQuestionIndex("OPAvpYNf9AQJ82qN4VYQAQnjYn72", 10);
    res.status(200).send('Data saved successfully.');
};

exports.resetAnimals = async (req, res) => {
    //const user = req.user;
    await animalsService.resetScore("OPAvpYNf9AQJ82qN4VYQAQnjYn72")
    await animalsService.resetQuestionNumber("OPAvpYNf9AQJ82qN4VYQAQnjYn72")
    //animalsService.updateQuestionIndex(user.user_id, 0);
    res.status(200).send('Data saved successfully.');
};

exports.getAnimals = async (req, res) => {

    //const user = req.user;

    var questionIndex = await animalsService.getQuestionIndex("OPAvpYNf9AQJ82qN4VYQAQnjYn72");
    await animalsService.updateQuestionIndex("OPAvpYNf9AQJ82qN4VYQAQnjYn72", questionIndex + 1 >= animalsActivity.questions.length ? 0 : questionIndex + 1)
    questionIndex = await animalsService.getQuestionIndex("OPAvpYNf9AQJ82qN4VYQAQnjYn72");
    await animalsService.updateQuestionNumber("OPAvpYNf9AQJ82qN4VYQAQnjYn72", await animalsService.getQuestionNumber("OPAvpYNf9AQJ82qN4VYQAQnjYn72") + 1)

    const text = animalsActivity.questions[questionIndex]
    
    try {
        // Read the image file synchronously and encode it in base64
        const imageBuffer = fs.readFileSync(path.join(__dirname, '..','activities',"animals",text + ".png"));
        const base64Image = imageBuffer.toString('base64');
    
        const responseData = {
          text: text,
          imageBase64: base64Image,
        };
    
        res.status(200).send(responseData);
      } catch (err) {
        res.status(500).send({ error: 'Error' });
      }

};

exports.postResponse = async (req, res) => {
    //const user = req.user;
    try {
        const inputBuffer = req.file.buffer;
        const convertedAudio = await sttService.convertAudio(inputBuffer);
        const recognitionResult = await sttService.recognizeSpeech(convertedAudio);
        const processedText = sttService.processRecognitionResult(recognitionResult);

        const questionIndex = await animalsService.getQuestionIndex("OPAvpYNf9AQJ82qN4VYQAQnjYn72");

        console.log("Response : " + processedText)
        // similarity
        var textSim = stringSimilarity.compareTwoStrings(processedText?.toLowerCase().trim(), animalsActivity.questions[questionIndex]?.toLowerCase().trim(),);



        const string1 = processedText?.toLowerCase().trim();
        const string2 = animalsActivity.questions[questionIndex]?.toLowerCase().trim();


        const soundex1 = soundex(string1)
        const soundex2 = soundex(string2)

        const soundSim = stringSimilarity.compareTwoStrings(soundex1?.toLowerCase().trim(), soundex2?.toLowerCase().trim())

        const similarity = Math.max(soundSim, textSim)
        console.log("Sim : ",soundSim,textSim)
        console.log(similarity)

        const questionNumber = await animalsService.getQuestionNumber("OPAvpYNf9AQJ82qN4VYQAQnjYn72");
        const finished = questionNumber > 4
        const passed = similarity > 0.66
        const text = animalsActivity.questions[questionIndex]
        if (passed) {
            await animalsService.updateScore("OPAvpYNf9AQJ82qN4VYQAQnjYn72")
        }
        const score = (await animalsService.getScore("OPAvpYNf9AQJ82qN4VYQAQnjYn72")).score

        if (finished) {
            await animalsService.resetScore("OPAvpYNf9AQJ82qN4VYQAQnjYn72")
        }
        res.status(200).send({ text: text, similarity: similarity, passed: passed, finished: finished, score: score });

    } catch (error) {
        console.error("Error performing speech-to-text with Wit.ai:", error);
        res.status(500).send("Error performing speech-to-text with Wit.ai");
    }

};