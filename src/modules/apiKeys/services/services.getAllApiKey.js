const { APIKey } = require('../../../models');


const getAllApiKey = async (orgId) => {

  const apiResult = await APIKey.find({ orgId, active: true });
  //map all these api keys as -> 16characters...
  let result = apiResult.map((key, i) => {
    return { apiKey: key.apiKey.slice(0, 32) + '...', _id: key._id, name: key.name, createdAt: key.createdAt, expires: key.expires, lastused: key.lastUsed };
  })
  return result;
};


module.exports = getAllApiKey
