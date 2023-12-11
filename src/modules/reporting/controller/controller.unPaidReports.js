const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const getReportingService = require('../services/index');

//super admin apis
const unPaidReports = catchAsync(async (req, res) => {
  let { page,
    limit,
    search,
    startDate,
    endDate,
    currencyId ,sort} = await pick(req.query, ['page',
      'limit',
      'search',
      'startDate',
      'endDate',
      'currencyId','sort'])
  limit=limit>10?limit:10;
  page=page>1?page:1;
  const result = await getReportingService.getSpecificReports(page, limit, startDate, endDate, currencyId , search ,sort ,null ,0);


  if (result) {
    sendResponse(res, httpStatus.OK, result, null, "");
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to get data, please try again');
  }
});
module.exports = unPaidReports;