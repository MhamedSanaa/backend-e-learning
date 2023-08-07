
const speechToText = require('@google-cloud/speech-to-text');

exports.speech2Text = async (req, res) => {
    const audioBuffer = req.body.audio;
  
    const client = new speechToText.SpeechToTextClient();
  
    const config = {
      encoding: 'LINEAR16',
      sample_rate_hertz: 16000,
    };
  
    const transcript = await client.transcribe({
      audio: audioBuffer,
      config: config,
    });
  
    const text = transcript.results[0].alternatives[0].transcript;
  
    res.send({
      text: text,
    });
  }
