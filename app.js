const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express()
const port = 3333

const ttsRouter = require('./routes/tts'); // Import the router
const sttRouter = require('./routes/stt'); // Import the router

app.use(cors());
app.use(express.json());

const speechToTextRoute = require("./routes/speechToText");
app.use("/stt", sttRouter);
app.use("/tts", ttsRouter)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})