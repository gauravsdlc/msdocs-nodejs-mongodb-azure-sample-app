const Joi = require('joi');

const addPoints = {
  body: Joi.object().keys({
    refId: Joi.string().required(),
    customerId: Joi.string().required(),
    organizationId: Joi.string().required(),
    transferTo: Joi.string().required(),
    amount: Joi.number().required(),
    currencyId: Joi.string().required(),
    toCurrencyId: Joi.string().required(),
  }),
};
const getPoints = {
  query: Joi.object().keys({
    transferTo: Joi.string(),
    organizationId: Joi.string(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  }),
};
module.exports = {
  addPoints,
    getPoints
};
