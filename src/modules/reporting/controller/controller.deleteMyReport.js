const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const getReportingService = require('../services/index');

//super admin apis
const deleteMyReport = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ['id'])
  const orgId = req.user ? req.user.orgId : null

  const report = await getReportingService.deleteReportById(id, orgId);
  if (report) {
    sendResponse(res, httpStatus.OK, "Report Deleted successfully!", null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to delete Report');
  }
});
module.exports = deleteMyReport;