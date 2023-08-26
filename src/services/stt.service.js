const axios = require('axios');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const config = require("../config/config");
const WIT_TOKEN = config.WIT_TOKEN;

exports.convertAudio = async (audioBuffer) => {
    try {
        const tempInputFilePath = 'input.webm';
        fs.writeFileSync(tempInputFilePath, audioBuffer);
        const outputFilePath = 'output.wav';

        await new Promise((resolve, reject) => {
            ffmpeg()
                .input(fs.createReadStream(tempInputFilePath))
                .audioCodec('pcm_s16le')
                .output(outputFilePath)
                .on('end', () => {
                    console.log('Conversion completed');
                    fs.unlinkSync(tempInputFilePath);
                    resolve();
                })
                .on('error', (err) => {
                    console.error('Error:', err);
                    fs.unlinkSync(tempInputFilePath);
                    reject(err);
                })
                .run();
        });

        return fs.readFileSync(outputFilePath);
    } catch (error) {
        console.error("Error converting audio:", error);
        throw new Error("Error converting audio");
    }
};

exports.recognizeSpeech = async (wavBuffer) => {
    try {
        const witResponse = await axios.post('https://api.wit.ai/speech', wavBuffer, {
            headers: {
                'Authorization': `Bearer ${WIT_TOKEN}`,
                'Content-Type': 'audio/wav'
            }
        });

        return witResponse.data;
    } catch (error) {
        console.error("Error performing speech recognition with Wit.ai:", error);
        throw new Error("Error performing speech recognition with Wit.ai");
    }
};


exports.processRecognitionResult = (data) => {
    if (typeof data === 'string') {
        let k = data?.lastIndexOf('}');
        if (k > 0) {
            let brackets = 1;
            do {
                k--;
                if (data[k] === "{")
                    brackets--;
                else if (data[k] === "}")
                    brackets++;
            } while (k > 0 && brackets > 0);
        }
        const str = data?.substring(k);
        return JSON.parse(str)?.text;
    } else {
        return data.text;
    }
};