const admin = require('firebase-admin');

exports.getProfile = (req, res) => {
  const user = req.user;

  
  console.log(user)
  // Here you can fetch additional user data from your database or Firebase
  // For simplicity, returning the user's UID and email
  res.json({ uid: user.uid, email: user.email });
};
