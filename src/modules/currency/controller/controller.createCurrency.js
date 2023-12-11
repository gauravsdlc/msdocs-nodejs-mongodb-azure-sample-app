const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { addCurrency,listCurrencies ,changeCurrencyStatus,getCurrency, deleteCurrencyById, listMyCurrencies, updateCurrencyById} = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const Currency = require('../currency.model')

const createCurrency = catchAsync(async (req, res) => {

  const {
    name,
    prefix,
    logo,
    conversionRate
  } = await pick(req.body, [
    "name",
    "prefix",
    "logo",
    "conversionRate"
  ])
  const isCurrencyNameTaken = await Currency.isCurrencyNameTaken(name)
  if (isCurrencyNameTaken) {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Currency Name already taken');
    return
  }
  const isPrefixTaken = await Currency.isCurrencyPrefixTaken(prefix)
  if (isPrefixTaken) {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Currency Prefix already taken');
    return
  }
  const currency = await addCurrency({name,prefix,logo,conversionRate});

  if (currency) {
    sendResponse(res, httpStatus.OK, { msg: "Currency Created Successfully", currency }, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg: 'Something went wrong'});
  }
});


module.exports = createCurrency