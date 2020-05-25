const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

function auth(req, res, next) {
  const token = req.header('x-auth-token');

  // Check for token
  if(!token) res.status(401).json({msg: 'No token, authorization denied'});

  try {
    // If it exists lets check it
    const decoded = jwt.verify(token, keys.secretOrKey);
    //Add user from the payload
    req.user = decoded;
  next();
  } catch(e) {
    res.status(400).json({msg: 'Token is not valid'});
  }
}

module.exports = auth;