const Joi = require('joi');
const {  objectId, endpointUrl } = require('../../validations/custom.validation');


const generateApiKey = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    endpointUrl: Joi.custom(endpointUrl),
    whitelist: Joi.array(),
  }),
};

const revealApiKey = {
  params: Joi.object().keys({
    apiKey:Joi.custom(objectId).required()
  }),
};

const getApiKeys = {
  params: Joi.object().keys({
    organizationId:Joi.string().required()
  }),
};

module.exports = {
  
//   deleteApiKey,
  generateApiKey,
  revealApiKey,
  getApiKeys
};
