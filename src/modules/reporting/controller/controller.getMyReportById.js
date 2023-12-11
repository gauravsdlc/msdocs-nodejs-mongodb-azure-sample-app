const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const getReportingService = require('../services/index');

//super admin apis
const getMyReportById = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ['id'])
  // const userId = req.user ? req.user._id : null

  // const report = await getReportingService.getReportById(id, userId);
  const report = await getReportingService.getReportById(id);
  if (report) {
    sendResponse(res, httpStatus.OK, report, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg: 'Not able to Get report' });
  }
});
module.exports = getMyReportById;