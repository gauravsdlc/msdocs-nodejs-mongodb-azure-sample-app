const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const getReportingService = require('../services/index');
const { superAdminRole } = require('../../../config/roles');
const getSuperAdminDetails = require('../services/getSuperAdminData.service');

//super admin apis
const receivedReports = catchAsync(async (req, res) => {
  let { page,
    limit=10,
    search,
    startDate,
    endDate,
    currencyId,
    sort,
    status
  } = await pick(req.query, ['page',
      'limit',
      'search',
      'startDate',
      'endDate',
      'currencyId','sort','status'])

  const orgId = req.user.orgId 
  let isAdmin = req.user.role == superAdminRole

  const result = await getReportingService.getReceivedReports({page: Number(page), limit: Number(limit), startDate, endDate, currencyId , search , sort, orgId, status, isAdmin});
  if (result) {
    sendResponse(res, httpStatus.OK, result, null, "");
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to get data, please try again');
  }
});
module.exports = receivedReports;