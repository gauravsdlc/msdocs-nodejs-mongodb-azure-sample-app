const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const getReportingService = require('../services/index');
const { roles } = require('../../../config/roles');

//super admin apis
const updateReportById = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ['id'])
  // const { status } = await pick(req.body, ['status'])
  let report;
  if(req.user.role!=roles[0]){// for orgAdmin
   report = await getReportingService.updateReportStatusById(id, req.body, req.user.organizationId);
  }
  else{
    report = await getReportingService.updateReportStatusById(id, req.body);
  }
  if (report) {
    sendResponse(res, httpStatus.OK, report, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg: 'Not able to Get report' });
  }
});

module.exports = updateReportById;