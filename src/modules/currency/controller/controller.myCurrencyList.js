const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { addCurrency,listCurrencies ,changeCurrencyStatus,getCurrency, deleteCurrencyById, listMyCurrencies, updateCurrencyById} = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const myCurrencyList = catchAsync(async (req, res) => {
  let options = req.body.options || {};
  let filter = req.body.filter || {}
  const orgId=req.user?req.user.orgId:null

  const list = await listMyCurrencies(options, filter,orgId);
  if (list) {
    sendResponse(res, httpStatus.OK, list, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg: 'Not able to get Currency, please try again'});
  }
});

module.exports = myCurrencyList