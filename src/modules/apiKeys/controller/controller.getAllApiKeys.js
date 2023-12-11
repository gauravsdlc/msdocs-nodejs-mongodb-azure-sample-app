
const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { getAllApiKey} = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const getAllApiKeys = catchAsync(async (req, res) => {
  let {user} = await pick(req, ['user']);
  const result = await getAllApiKey(user.orgId);
  if (result) {
    sendResponse(res, httpStatus.OK, result, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to get API keys, please try again');
  }
});
module.exports =  getAllApiKeys