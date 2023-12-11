const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const getReportingService = require('../services/index');

//super admin apis
const updateMyReportById = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ['id'])
  const orgId = req.user ? req.user.orgId : null

  const report = await getReportingService.updateReportStatusById(id, req.body, orgId);
  if (report) {
    sendResponse(res, httpStatus.OK, report, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg: 'Not able to Get report' });
  }
});
module.exports = updateMyReportById;