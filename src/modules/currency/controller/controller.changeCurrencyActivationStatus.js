const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { addCurrency,listCurrencies ,changeCurrencyStatus,getCurrency, deleteCurrencyById, listMyCurrencies, updateCurrencyById} = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const changeCurrencyActivationStatus = catchAsync(async (req, res) => {
  const {status}=await pick(req.body,['status'])
  const {id}=await pick(req.params,['id'])

  const removedOrg = await changeCurrencyStatus(id, status);
  if (removedOrg) {
    sendResponse(res, httpStatus.OK, { msg:  "Activation Status Changed!" }, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg:  'Not able to Change Currency Status'});
  }
});


module.exports = changeCurrencyActivationStatus