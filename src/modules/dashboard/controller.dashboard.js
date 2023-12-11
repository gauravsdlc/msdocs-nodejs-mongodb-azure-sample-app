const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/responseHandler');
const getDashboardService  = require('./service.dashboard');

const getDashboardData = catchAsync(async (req, res) => {

  const result = await getDashboardService.getDashboardData();

    if (result) {
        sendResponse(res, httpStatus.OK, result, null, "");
    } else {
        sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to get data, please try again');
    }
});


module.exports = {getDashboardData};