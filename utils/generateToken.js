// utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ user: id }, process.env.JWT_SECRET || 'defaultsecret', {
    expiresIn: '30d', // Token expiration time, adjust as needed
  });
};

module.exports = generateToken; 