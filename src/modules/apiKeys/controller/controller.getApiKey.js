
const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { getApiKey} = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const getApiKeys = catchAsync(async (req, res) => {

  let {organizationId} = await pick(req.params, ['organizationId']);
  const result = await getApiKey(organizationId);
  if (result) {
    sendResponse(res, httpStatus.OK, result, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to get API keys, please try again');
  }
});
module.exports =  getApiKeys