const Joi = require('joi');
const { objectId } = require('../../validations/custom.validation');


const createCurrency = {
    body: Joi.object().keys({
        conversionRate: Joi.number().required(),
        name: Joi.string().required(),
        prefix: Joi.string().required(),
        logo: Joi.string().required(),
    })
};

const getCurrencyById = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    }),
};
const changeCurrencyStatusById = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    }),
    body: Joi.object().keys({
        status: Joi.boolean(),
    })
};
const updateCurrencyById = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    }),
    body: Joi.object().keys({
        name: Joi.string(),
        prefix: Joi.string(),
        logo: Joi.string(),
        conversionRate: Joi.number(),
    })
};
const getCurrencyList = {
    query: Joi.object().keys({
        page: Joi.number(),
        limit: Joi.number(),
        search: Joi.string(),
        startDate:Joi.date(),
        endDate:Joi.date(),
        currencyId:Joi.custom(objectId),
        sort:Joi.number()
    }),
};


module.exports = {
    createCurrency,
    changeCurrencyStatusById,
    getCurrencyById,
    getCurrencyList
    , updateCurrencyById,
};