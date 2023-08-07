const axios = require('axios');

const API_KEY = 'fb7aee3c3958452499cc11cbced32917';

exports.text2Speech = async (req, res) => {
    const text = req.body.text;
    const lang = 'en-us';
    const speed = 0;
    const format = 'mp3';

    const url = `http://api.voicerss.org/?key=${API_KEY}&hl=${lang}&src=${encodeURIComponent(text)}&r=${speed}&c=${format}`;

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
