const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express()
const port = 3333


app.use(cors());
app.use(express.json());

const speechToTextRoute = require("./routes/speechToText");
app.use("/stt", speechToTextRoute);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})