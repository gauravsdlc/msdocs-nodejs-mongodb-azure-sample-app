const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { addCurrency,listCurrencies ,changeCurrencyStatus,getCurrency, deleteCurrencyById, listMyCurrencies, updateCurrencyById} = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const Currency = require('../currency.model')

const changeCurrencyById = catchAsync(async (req, res) => {
    const {name, logo, prefix, conversionRate}=await pick(req.body,['name','logo','prefix', 'conversionRate'])
    const {id}=await pick(req.params,['id'])

    const isCurrencyNameTaken = await Currency.isCurrencyNameTaken(name, id)
    if (isCurrencyNameTaken) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, 'Currency Name already taken');
      return
    }
    const isPrefixTaken = await Currency.isCurrencyPrefixTaken(prefix, id)
    if (isPrefixTaken) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, 'Currency Prefix already taken');
      return
    }
  // console.log("data",{name,logo,prefix});
    const removedOrg = await updateCurrencyById(id, req.body);
    if (removedOrg) {
      sendResponse(res, httpStatus.OK, { msg:  "Currency updated successfully!" }, null);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, { msg:  'Not able to Change Currency Data'});
    }
  });


module.exports = changeCurrencyById