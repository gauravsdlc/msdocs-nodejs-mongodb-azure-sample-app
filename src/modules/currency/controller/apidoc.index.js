const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const currencyService = require('../services/index');
const { sendResponse } = require('../../../utils/responseHandler');


const listOrganization = catchAsync(async (req, res) => {
//   console.log("req ", req.user);

    const list = await currencyService.listCurrency();
    if (list) {
      sendResponse(res, httpStatus.OK, list, null);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to get Currency, please try again');
    }
  });

const currencyDetails = catchAsync(async(req, res)=>{
const list = await currencyService.currencyDetails();
if (list) {
  sendResponse(res, httpStatus.OK, list, null);
} else {
  sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to get Currency, please try again');
}
})


module.exports = {
    listOrganization,
    currencyDetails
  };
