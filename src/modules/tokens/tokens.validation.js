const Joi = require('joi');
const { objectId } = require('../../validations/custom.validation');


const createTokens = {
    body: Joi.object().keys({
        amount: Joi.number().required(),
        walletAddress:Joi.string().required(),
        trnxHash: Joi.string().required(),
        from: Joi.string().required(),
        orgId: Joi.custom(objectId).required(),
    })
};

const getTokensById = {
    params: Joi.object().keys({
        orgId: Joi.required(),
    }),
};

const getTokenHistoryByOrgId = {
    params: Joi.object().keys({
        orgId: Joi.required(),
    }),
};



module.exports = {
    createTokens,
    getTokensById,
    getTokenHistoryByOrgId
};