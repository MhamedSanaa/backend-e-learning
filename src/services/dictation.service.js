const admin = require('firebase-admin');
const db = admin.firestore();

// Question Index
exports.getQuestionIndex = async (userId) => {
    const docRef = db.collection('dictation').doc(userId);
    const doc = await docRef.get();
    return doc.data()?.questionIndex || 0;
};
exports.updateQuestionIndex = async (userId, questionIndex) => {
    const docRef = db.collection('dictation').doc(userId);
    await docRef.set({ questionIndex : questionIndex }, { merge: true });
};

// Question Number
exports.getQuestionNumber = async (userId) => {
    const docRef = db.collection('dictation').doc(userId);
    const doc = await docRef.get();
    return doc.data()?.questionNumber || 0;
};
exports.updateQuestionNumber = async (userId, questionNumber) => {
    const docRef = db.collection('dictation').doc(userId);
    await docRef.set({ questionNumber : questionNumber }, { merge: true });
};
exports.resetQuestionNumber = async (userId) => {
    const docRef = db.collection('dictation').doc(userId);
    await docRef.set({ questionNumber : 0 }, { merge: true });
};

// Respond
exports.respondQuestion = async (userId) => {
    const docRef = db.collection('dictation').doc(userId);
    const doc = await docRef.get();
    return doc.data()?.questionIndex || 0;
};

// Score
exports.getScore = async (userId) => {
    const docRef = db.collection('dictation').doc(userId);
    const doc = await docRef.get();
    return {score : doc.data()?.score || 0, highScore : doc.data()?.highScore || 0};
};
exports.updateScore = async (userId) => {
    const docRef = db.collection('dictation').doc(userId);
    const doc = await docRef.get();
    const score = (doc.data()?.score || 0) + 1;
    const highScore = doc.data()?.highScore || 0;
    await docRef.set({ score : score, highScore : score <= highScore ? highScore : score }, { merge: true });
};
exports.resetScore = async (userId) => {
    const docRef = db.collection('dictation').doc(userId);
    await docRef.set({ score : 0 }, { merge: true });
};

