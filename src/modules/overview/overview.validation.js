const Joi = require('joi');
const { objectId } = require('../../validations/custom.validation');


const getOverviewByOrgId = {
    params: Joi.object().keys({
        orgId: Joi.custom(objectId).required(),
    }),
};



module.exports = {
    getOverviewByOrgId,
};