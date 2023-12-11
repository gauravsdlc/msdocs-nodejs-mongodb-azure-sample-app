const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const getReportingService = require('../services/index');
const getSuperAdminDetails = require('../services/getSuperAdminData.service');

//super admin apis
const createReportingData = catchAsync(async (req, res) => {
  const {
    amount,
    dueDate,
    createdFor,
    calculatedPoints,
    pointsArray
  } = await pick(req.body, [
    "amount",
    "dueDate",
    "createdFor",
    "calculatedPoints",
    "pointsArray"
  ])

  const admin = await getSuperAdminDetails()
  const report = await getReportingService.addReport({
    amount,
    dueDate,
    calculatedPoints,
    pointsArray,
    invoiceGeneratedBy: admin.orgId,
    invoiceGeneratedFor: createdFor
  });

  if (report) {
    sendResponse(res, httpStatus.OK, { msg: "Invoice Created Successfully", report }, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg: 'Something went wrong' });
  }
});
module.exports = createReportingData;