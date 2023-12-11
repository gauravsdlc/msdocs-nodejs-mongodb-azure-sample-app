const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const getReportingService = require('../services/index');
const getSuperAdminDetails = require('../services/getSuperAdminData.service');

//super admin apis
const createReport = catchAsync(async (req, res) => {
  const organizationId = req.user ? req.user.organizationId : null

  const {
    amount,
    dueDate,
    startDate,
    endDate,
    calculatedPoints,
    pointsArray,
  } = await pick(req.body, [
    "amount",
    "dueDate",
    "startDate",
    "endDate",
    "calculatedPoints",
    "pointsArray"
  ])

  let admin = await getSuperAdminDetails()
  console.log("admin::", admin);

  const report = await getReportingService.addReport({
    amount,
    dueDate,
    startDate,
    endDate,
    calculatedPoints,
    pointsArray,
    invoiceGeneratedFor: admin.orgId, // doubt
    invoiceGeneratedBy: req.user.orgId

  });

  if (report) {
    sendResponse(res, httpStatus.OK, { msg: "Invoice Created Successfully", report }, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg: 'Something went wrong' });
  }
});
module.exports = createReport;