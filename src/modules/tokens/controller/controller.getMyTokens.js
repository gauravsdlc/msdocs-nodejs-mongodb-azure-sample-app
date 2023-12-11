const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { totalTokens } = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const getMyTokens = catchAsync(async (req, res) => {
  // const {
  //   user
  // } = await pick(req, "user")
  console.log("user::",req.user.organizationId);
  const list = await totalTokens(req.user.organizationId);
  if (list) {
    sendResponse(res, httpStatus.OK, list, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg: 'Not able to get Token, please try again' });
  }
});

module.exports = getMyTokens