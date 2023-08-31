const hangmanActivity = require("../activities/hangmanActivity")
const admin = require('firebase-admin');
const db = admin.firestore();

exports.createRoom = async (userId) => {
    const code = Math.floor(Math.random() * (1000000 + 100) - 100);

    const docRef = db.collection('hangmanRoom').doc("" + code);

    const questionIndex = Math.floor(Math.random() * (hangmanActivity.questions.length));
    const word = hangmanActivity.questions[questionIndex]
    var hiddenWord = ""

    for (let i of word){
        hiddenWord += "-"
    }

    const positions = shuffledNumbers(word.length)

    await docRef.set({
        word: word.toLowerCase(),
        code: code,
        owner: userId,
        players: [userId],
        hiddenWord: hiddenWord,
        shuffledNumbers : positions,
        tryIndex : 0,
        gameOver : false,
        messages: [
            {
                text: `${userId} joined.`,
                sender: `admin`
            }
        ],

        locked: false,
        currentPlayer: userId,
        currentPlayerIndex:0,
    },
        { merge: true });

    return { code, owner: userId, word }
};

exports.joinRoom = async (userId, code) => {
    const docRef = db.collection('hangmanRoom').doc("" + code);
    if (await roomExists(code)) {
        console.log("exist")
        var data = await roomData(code)
        const locked = data.locked
        console.log("locked : ", locked)
        if (locked) {
            return {joined : false,code:code}
        }
        else {
            await docRef.update({
                players: admin.firestore.FieldValue.arrayUnion(userId),
                messages: admin.firestore.FieldValue.arrayUnion({
                    text: `${userId} joined.`,
                    sender: `admin`
                }
                )
            })
            await docRef.set({
                locked: true,
            },
                { merge: true });
            data = await roomData(code)
            const players = data.players
            const currentPlayerIndex = Math.floor(Math.random() * (2))
            await docRef.update({
                currentPlayer: players[currentPlayerIndex],
                currentPlayerIndex
            })

            return {joined : true,code:code}
        }
    }
    else {
        return {joined : false,code:code}
    }

}


exports.sendResponse = async (userId, code, msg) => {
    console.log(code)
    const message = msg.toLowerCase()
    const docRef = db.collection('hangmanRoom').doc("" + code);
    const data = await roomData(code)
    const word = data.word
    var gameOver = data.gameOver

    var hiddenWord = data.hiddenWord
    const messages = data.messages

    var currentPlayerIndex=data.currentPlayerIndex
    if (await roomExists(code) && data.locked && data.currentPlayer === userId && !gameOver) {

        messages.push({
            text : `${message}.`,
            sender : `${userId}`
        })
        await docRef.update({
            messages: messages
        })
        if (message === word) {
            hiddenWord = word
            gameOver = true
            await docRef.update({
                winner: userId,
                gameOver : gameOver,
                messages: admin.firestore.FieldValue.arrayUnion({
                    text: `${userId} Wins.`,
                    sender: `admin`
                }
                )
            })

        }
        
        
        else{
            hiddenWord = hiddenWord.substr(0, data.shuffledNumbers[data.tryIndex]) + word[data.shuffledNumbers[data.tryIndex]] + hiddenWord.substr(data.shuffledNumbers[data.tryIndex] + 1);
            gameOver = hiddenWord === word

            if(gameOver){
                await docRef.update({
                    gameOver : true,
                    messages: admin.firestore.FieldValue.arrayUnion({
                        text: `Game over, no winner.`,
                        sender: `admin`
                    }
                    )
                })
            }
        }

        currentPlayerIndex = currentPlayerIndex == 0 ? 1 : 0 


        await docRef.set({
            currentPlayer: data.players[currentPlayerIndex],
            currentPlayerIndex : currentPlayerIndex,
            tryIndex : data.tryIndex+1,
            hiddenWord : hiddenWord,
            gameOver : gameOver
        },
            { merge: true });
        
        return true
    }
    return false
}


const roomExists = async (code) => {
    const docRef = db.collection('hangmanRoom').doc("" + code);
    const docSnapshot = await docRef.get()
    return docSnapshot.exists
}

const roomData = async (code) => {
    const docRef = db.collection('hangmanRoom').doc("" + code);
    const doc = await docRef.get()
    return doc.data()
}

const shuffledNumbers = (n) => {
    if (n <= 0) {
        return [];
    }
    const numbers = Array.from({ length: n }, (_, index) => index);
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
}