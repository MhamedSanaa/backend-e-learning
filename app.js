const express = require('express');
const cors = require('cors');
const app = express()

const admin = require('firebase-admin');
const serviceAccount = require('./adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://immersive-learning-default-rtdb.europe-west1.firebasedatabase.app/'
});
const port = 3333

const ttsRouter = require('./src/routes/tts.route');
const sttRouter = require('./src/routes/stt.route');
const userRouter = require('./src/routes/user.route');
const dictationRouter = require('./src/routes/dictation.route');
const speakingRouter = require('./src/routes/speaking.route');



app.use(cors());
app.use(express.json());

app.use("/stt", sttRouter);
app.use("/tts", ttsRouter)
app.use("/user", userRouter)
app.use("/dictation", dictationRouter)
app.use("/speaking", speakingRouter)

//Hello world
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})