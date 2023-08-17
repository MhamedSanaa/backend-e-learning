const admin = require('firebase-admin');

exports.isAuthenticated = async (req, res, next) => {
  const idToken = req.headers.authorization;

  if (!idToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken.split(' ')[1]);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};