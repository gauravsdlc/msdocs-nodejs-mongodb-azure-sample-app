const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const services = require("../services/index");
const pick = require('../../../utils/pick');

const getTransaction = catchAsync(async (req, res) => {

  const { page, limit } = await pick(req.query, ["page","limit",]);
  const transaction = await services.getTransaction(req.user.orgId, page, limit);
  if (transaction?.status) {
    sendResponse(res, httpStatus.OK, transaction, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg: 'Not able to Get transaction'});
  }
});



module.exports = getTransaction
