const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const services = require('../services/index')

const getSingleTransaction = catchAsync(async (req, res) => {
  const {id}=await pick(req.params,['id'])

  const response = await services.getSingleTransaction(id);
  if (response) {
    sendResponse(res, httpStatus.OK, response , null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg:  'Transaction not found'});
  }
});


module.exports = getSingleTransaction