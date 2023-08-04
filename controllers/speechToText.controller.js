const axios = require('axios');

const accessToken = ''; // Replace with your Wit.ai access token
const witApiUrl = 'https://api.wit.ai/speech';

exports.speechToText = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file provided.' });
        }

        const { path } = req.file;

        // Send the audio file to Wit.ai for transcription
        const witApiKey = 'JXH3LEBMTO4COMU3OJ3M527JPPVBSZUI';
        const witApiUrl = 'https://api.wit.ai/speech';
        const headers = {
            Authorization: `Bearer ${witApiKey}`,
            'Content-Type': 'audio/wav',
        };

        const witApiResponse = await axios.post(witApiUrl, req.file.buffer, { headers });
        console.log('Wit.ai API Response:', witApiResponse.data);

        // You can return the transcription or other data back to the frontend as needed
        res.json({ text: witApiResponse.data.text });
    } catch (error) {
        console.error('Error in API call:', error);
        res.status(500).json({ error: 'Something went wrong.' });
    }
    res.json({text:"hiiii"})
};