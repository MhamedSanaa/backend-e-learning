const axios = require('axios');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const WIT_TOKEN = 'H7N5VMTYKZQG76UKSNRYMRMY6O4FCWNJ';
const { Readable } = require('stream');

exports.speech2Text = async (req, res) => {
  try {
    const inputBuffer = req.file.buffer;

    const outputFilePath = 'output.wav';

    const tempInputFilePath = 'input.webm';
    fs.writeFileSync(tempInputFilePath, inputBuffer);

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

    const wavBuffer = fs.readFileSync(outputFilePath);



    const witResponse = await axios.post('https://api.wit.ai/speech', wavBuffer, {
      headers: {
        'Authorization': `Bearer ${WIT_TOKEN}`,
        'Content-Type': 'audio/wav'
      }
    });


    const data = witResponse.data;

    console.log(data, typeof data)

    let k = data?.lastIndexOf('}')
    if (k > 0) {

      let brackets = 1

      do {
        k--
        if (data[k] === "{")
          brackets--;
        else if (data[k] === "}")
          brackets++;
      }
      while (k > 0 && brackets > 0)

    }
    let str = data?.substr(k)

    res.status(200).json(JSON.parse(str)?.text);
  } catch (error) {
    console.error("Error performing speech-to-text with Wit.ai:", error);
    res.status(500).send("Error performing speech-to-text with Wit.ai");
  }
}
