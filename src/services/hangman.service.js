const hangmanActivity = require("../activities/hangmanActivity")
const admin = require('firebase-admin');
const db = admin.firestore();

exports.createRoom = async (userId) => {
    const code = Math.floor(Math.random() * (1000000 + 100) - 100);

    const docRef = db.collection('hangmanRoom').doc("" + code);

    const questionIndex = Math.floor(Math.random() * (hangmanActivity.questions.length));
    const word = hangmanActivity.questions[questionIndex]
    await docRef.set({
        word: word.toLowerCase(),
        code: code,
        owner: userId,
        players: [userId],
        messages: [
            {
                [`${userId}`]: `${userId} joined.`
            }
        ],

        locked: false,
        currentPlayer: userId
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
            return false
        }
        else {
            await docRef.update({
                players: admin.firestore.FieldValue.arrayUnion(userId),
                messages: admin.firestore.FieldValue.arrayUnion({[`${userId}`]: `${userId} joined.`})
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

            return true
        }
    }
    else {
        return false
    }

}


exports.sendResponse = async (userId, code, message) => {
    const word = message.toLowerCase()
    const docRef = db.collection('hangmanRoom').doc("" + code);
    const data = await roomData(code)
    if (await roomExists(code) && data.locked && data.currentPlayer === userId) {
        await docRef.update({
            messages: admin.firestore.FieldValue.arrayUnion({[`${userId}`]: `${userId} : ${word}.`})
        })
        if(message === data.word){
            await docRef.set({ winner : userId }, { merge: true })
        }
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