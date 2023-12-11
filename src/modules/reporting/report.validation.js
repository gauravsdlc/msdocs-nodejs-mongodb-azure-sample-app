const Joi = require('joi');
const { objectId } = require('../../validations/custom.validation');


const createReport = {
    body: Joi.object().keys({
        createdFor: Joi.custom(objectId).allow(""),
        amount: Joi.number().required(),
        dueDate: Joi.date().allow(""),
        calculatedPoints: Joi.number().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        pointsArray:Joi.array().required()
    })
};
const createOrgReport = {
    body: Joi.object().keys({
        createdFor: Joi.custom(objectId).allow(""),
        dueDate: Joi.date().allow(""),
        amount: Joi.number().required(),
        startDate: Joi.date().required(),
        calculatedPoints: Joi.number().required(),
        endDate: Joi.date().required(),
        pointsArray:Joi.array().required()
    })
};

const getReportById = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
        
    }),
};
const updateReportById = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    }),
    body: Joi.object().keys({
        status: Joi.number().required(),
        
    })
};
const getReportList = {
    query: Joi.object().keys({
        page: Joi.number(),
        limit: Joi.number(),
        search: Joi.string(),
        startDate:Joi.date(),
        endDate:Joi.date(),
        currencyId:Joi.custom(objectId),
        sort:Joi.number(),
        status:Joi.number()
    }),
};

const getMyReportList = {
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
    createReport,
    getReportById,
    getReportList
    , updateReportById,
    getMyReportList,
    createOrgReport
};