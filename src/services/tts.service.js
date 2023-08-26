const axios = require('axios');
const config = require("../config/config")
const VOICE_RSS_KEY = config.VOICE_RSS_KEY;

exports.generateAudio = async (text, lang = 'en-gb', speed = 0, format = 'wav', hz = '48khz_16bit_mono') => {
    const url = `http://api.voicerss.org/?key=${VOICE_RSS_KEY}&hl=${lang}&src=${encodeURIComponent(text)}&r=${speed}&c=${format}&f=${hz}`;

    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'arraybuffer'
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching TTS audio:", error);
        throw new Error("Error generating TTS audio");
    }
};