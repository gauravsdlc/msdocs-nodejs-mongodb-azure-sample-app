const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { totalTokens } = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const getTotalTokens = catchAsync(async (req, res) => {
  const {
    orgId
  } = await pick(req.params, [
    "orgId"
  ])
  const list = await totalTokens(orgId);
  if (list) {
    sendResponse(res, httpStatus.OK, list, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg: 'Not able to get Token, please try again' });
  }
});


module.exports = getTotalTokens