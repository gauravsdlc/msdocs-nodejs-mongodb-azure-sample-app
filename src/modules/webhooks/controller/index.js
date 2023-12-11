
const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const service = require('../services/addWebhooks.service');

const addWebhook = catchAsync(async (req, res) => {
    const orgId = req.user.orgId
    const {
        endpoint,
        description,        
    } = await pick(req.body, ['endpoint','description']);
  
    const result = await service.addWebhook({endpoint, description, orgId});
    if (result) {
      sendResponse(res, httpStatus.OK, result, null);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, 'Invalid data');
    }
  });

  const getWebhooks = catchAsync(async (req, res) => {
    const orgId = req.user.orgId
    const {start, limit } = await pick(req.query, ['start','limit']);
  
    const result = await service.getWebhooksByOrgId(orgId);
    if (result) {
      sendResponse(res, httpStatus.OK, result, null);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, 'Invalid data');
    }
  });
const getWebhooksByOrgId = catchAsync(async (req, res) => {
    console.log(req.user)
    const {orgId } = await pick(req.params, ['orgId']);
  
    const result = await service.getWebhooksByOrgId(orgId);
    if (result) {
      sendResponse(res, httpStatus.OK, result, null);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, 'Invalid data');
    }
  });

  const removeWebhookById = catchAsync(async (req, res) => {
    const {id } = await pick(req.params, ['id']);
    const orgId =  req.user.id
    const result = await service.removeWebhookById(id, orgId);
    if (result) {
      sendResponse(res, httpStatus.OK, result, null);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, 'Invalid data');
    }
  });


module.exports =  {
  addWebhook,
  getWebhooks,
  getWebhooksByOrgId,
  removeWebhookById
}
