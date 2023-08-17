const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./adminsdk.json');
const axios = require('axios');
const cors = require('cors');
const config = require("./src/config/config");
const app = express()
const port = 3333

const ttsRouter = require('./src/routes/tts');
const sttRouter = require('./src/routes/stt');
const userRouter = require('./src/routes/user');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://immersive-learning-default-rtdb.europe-west1.firebasedatabase.app/'
});

app.use(cors());
app.use(express.json());

app.use("/stt", sttRouter);
app.use("/tts", ttsRouter)
app.use("/user", userRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})