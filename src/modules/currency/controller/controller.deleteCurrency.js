const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { addCurrency,listCurrencies ,changeCurrencyStatus,getCurrency, deleteCurrencyById, listMyCurrencies, updateCurrencyById} = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const deleteCurrency = catchAsync(async (req, res) => {
  const {id}=await pick(req.params,['id'])

  const removedCurrency = await deleteCurrencyById(id);
  if (removedCurrency) {
    sendResponse(res, httpStatus.OK, "Currency Deleted successfully!", null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to Change Currency Status');
  }
});



module.exports = deleteCurrency