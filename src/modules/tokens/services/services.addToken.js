const httpStatus = require('http-status');
const mongoose = require('mongoose');
const  Token  = require('../tokens.model.js');

const addToken = async (tokenData) => {
  const token = await Token.create(tokenData);

  return token;
};
module.exports = addToken