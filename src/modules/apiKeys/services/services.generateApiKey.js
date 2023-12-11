const APIKey = require('../apiKey.model');

const generateApiKey = async (data) => {
    const apiKey= require('crypto').randomBytes(16).toString('hex')
    const apiResult = await APIKey.create({ ...data, apiKey });
    return apiResult;
  };
  

  module.exports = generateApiKey