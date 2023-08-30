const hangmanActivity = require("../activities/hangmanActivity")
const admin = require('firebase-admin');
const db = admin.firestore();

exports.createRoom = async (userId) => {
    const code = Math.floor(Math.random() * (1000000 + 100) - 100);
    
    const docRef = db.collection('hangmanRoom').doc(""+code);

    const questionIndex = Math.floor(Math.random() * (hangmanActivity.questions.length));
    const word = hangmanActivity.questions[questionIndex]
    await docRef.set({
        word: word,
        code: code,
        owner: userId,
        players: [userId],
        locked: false,
        currentPlayer : userId
    },
        { merge: true });

    return {code, owner : userId, word}
};

exports.joinRoom = async(userId,code) =>{
    const docRef = db.collection('hangmanRoom').doc(""+code);
    const docSnapshot = await docRef.get()
    if(docSnapshot.exists){
        console.log("exist")
        var doc = await docRef.get()
        const locked = doc.data()?.locked
        console.log("locked : ",locked)
        if(locked){
            return false
        }
        else{
            await docRef.update({
                players : admin.firestore.FieldValue.arrayUnion(userId)
            })
            await docRef.set({
                locked : true,
            },
                { merge: true });
            doc = await docRef.get()
            const players = doc.data()?.players
            const currentPlayerIndex = Math.floor(Math.random() * (2))
            await docRef.update({
                currentPlayer : players[currentPlayerIndex],
                currentPlayerIndex
            })

            return true
        }
    }
    else{
        return false
    }
 
}