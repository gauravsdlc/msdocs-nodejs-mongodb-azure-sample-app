const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { addCurrency,listCurrencies ,changeCurrencyStatus,getCurrency, deleteCurrencyById, listMyCurrencies, updateCurrencyById} = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const getCurrencyById = catchAsync(async (req, res) => {
  const {id}=await pick(req.params,['id'])
  const currency = await getCurrency(id,true);
  if (currency) {
    sendResponse(res, httpStatus.OK, currency, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg: 'Not able to Get Currency'});
  }
});



module.exports = getCurrencyById