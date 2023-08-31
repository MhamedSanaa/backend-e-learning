const ttsService = require("../services/tts.service")

exports.text2Speech = async (req, res) => {
    const text = req.body.text || "no text";
    const lang = req.body.lang || 'en-gb';
    const speed = req.body.speed || 0;
    const format = req.body.format ||'wav';
    const hz = req.body.hz || '48khz_16bit_mono';

    
    try {
        const audioData = await ttsService.generateAudio(text, lang, speed, format, hz);

        res.set('Content-Type', 'audio/mpeg');
        res.set('Cache-Control', 'public, max-age=300');

        res.send(audioData);
    } catch (error) {
        console.error("Error generating TTS audio:", error);
        res.status(500).send("Error generating TTS audio");
    }
};