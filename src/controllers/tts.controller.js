const axios = require('axios');
const config = require("../config/config")
const VOICE_RSS_KEY = config.VOICE_RSS_KEY;

exports.text2Speech = async (req, res) => {
    console.log(req.body.text)
    const text = req.body.text || "no text";
    const lang = req.body.lang || 'en-gb';
    const speed = req.body.speed || 0;
    const format = req.body.format ||'wav';
    const hz= req.body.hz || '48khz_16bit_mono'

    console.log(text,lang,speed,format,hz)
    const url = `http://api.voicerss.org/?key=${VOICE_RSS_KEY}&hl=${lang}&src=${encodeURIComponent(text)}&r=${speed}&c=${format}&f=${hz}`;

    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'arraybuffer'
        });
        

        res.set('Content-Type', 'audio/mpeg');
        res.set('Cache-Control', 'public, max-age=300'); // Optional: Add caching headers

        res.send(response.data);
    } catch (error) {
        console.error("Error fetching TTS audio:", error);
        res.status(500).send("Error generating TTS audio");
    }
};
