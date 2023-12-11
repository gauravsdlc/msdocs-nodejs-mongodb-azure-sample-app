const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const getReportingService = require('../services/index');

//super admin apis
const getReports = catchAsync(async (req, res) => {
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
  const result = await getReportingService.getReports( page, limit, startDate, endDate, currencyId , search ,sort );

  if (result) {
    sendResponse(res, httpStatus.OK, result, null, "");
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to get data, please try again');
  }
});
module.exports = getReports;
