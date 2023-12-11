
const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { revealkey} = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const revealApiKey = catchAsync(async (req, res) => {
  const { apiKey } = await pick(req.params, ['apiKey']);  
  let {user} = await pick(req, ['user']);

  const result = await revealkey(user.orgId , apiKey);
  if (result) {
    sendResponse(res, httpStatus.OK, result, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to get API key, please try again');
  }
});
module.exports = revealApiKey