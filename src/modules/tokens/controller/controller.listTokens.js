const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { listTokens } = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const { getBalance } = require('../../../utils/cryptoWalletHelper');
const { getOrgById, getUserByMembershipId } = require('../../../services/user.service');

const listToken = catchAsync(async (req, res) => {
  let options = req.body.options || {};
  let filter = req.body.filter || {}

  const {
    orgId
  } = await pick(req.params, [
    "orgId"
  ])

 
  
  const list = await listTokens(orgId,options, filter);
  if (list) {
    sendResponse(res, httpStatus.OK, list, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg: 'Not able to get Token, please try again' });
  }
});


module.exports = listToken