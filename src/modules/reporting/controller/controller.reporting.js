const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const getReportingService = require('../service.Reporting.js');

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
const getPaidReports = catchAsync(async (req, res) => {
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
  const result = await getReportingService.getSpecificReports(page, limit, startDate, endDate, currencyId , search ,sort ,null ,1);

  if (result) {
    sendResponse(res, httpStatus.OK, result, null, "");
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to get data, please try again');
  }
});
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
const pastDueReports = catchAsync(async (req, res) => {
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
  const result = await getReportingService.getSpecificReports(page, limit, startDate, endDate, currencyId , search ,sort ,null ,2);

  if (result) {
    sendResponse(res, httpStatus.OK, result, null, "");
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to get data, please try again');
  }
});
const createReportingData = catchAsync(async (req, res) => {

  const {
    amount,
    dueDate,
    createdBy,
    createdFor,
    currency
  } = await pick(req.body, [
    "amount",
    "dueDate",
    "createdBy",
    "createdFor",
    'currency'
  ])

  const report = await getReportingService.addReport({
    amount,
    dueDate,
    createdBy,
    createdFor,
    currency
  });

  if (report) {
    sendResponse(res, httpStatus.OK, { msg: "Invoice Created Successfully", report }, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg: 'Something went wrong' });
  }
});

const getReportById = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ['id'])
  const report = await getReportingService.getReportById(id);
  if (report) {
    sendResponse(res, httpStatus.OK, report, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg: 'Not able to Get report' });
  }
});

const updateReportById = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ['id'])
  const { status } = await pick(req.body, ['status'])

  const report = await getReportingService.updateReportStatusById(id, req.body);
  if (report) {
    sendResponse(res, httpStatus.OK, report, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg: 'Not able to Get report' });
  }
});

const deleteReport = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ['id'])

  const report = await getReportingService.deleteReportById(id);
  if (report) {
    sendResponse(res, httpStatus.OK, "Report Deleted successfully!", null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to delete Report');
  }
});


//org admin apis


const getMyReports = catchAsync(async (req, res) => {
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
  const _id = req.user ? req.user._id : null
  limit=limit>10?limit:10;
  page=page>1?page:1;
  const result = await getReportingService.getReports( page, limit, startDate, endDate, currencyId , search ,sort , _id);

  if (result) {
    sendResponse(res, httpStatus.OK, result, null, "");
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to get data, please try again');
  }
});
const getMyPaidReports = catchAsync(async (req, res) => {
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
  const _id = req.user ? req.user._id : null
  limit=limit>10?limit:10;
  page=page>1?page:1;
  const result = await getReportingService.getSpecificReports(page, limit, startDate, endDate, currencyId , search ,sort , _id,1);

  if (result) {
    sendResponse(res, httpStatus.OK, result, null, "");
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to get data, please try again');
  }
});

const myUnPaidReports = catchAsync(async (req, res) => {
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
  const _id = req.user ? req.user._id : null
  limit=limit>10?limit:10;
  page=page>1?page:1;

  const result = await getReportingService.getSpecificReports(page, limit, startDate, endDate, currencyId , search ,sort , _id,0);
  if (result) {
    sendResponse(res, httpStatus.OK, result, null, "");
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to get data, please try again');
  }
});
const myPastDueReports = catchAsync(async (req, res) => {
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
  const _id = req.user ? req.user._id : null
  limit=limit>10?limit:10;
  page=page>1?page:1;
  const result = await getReportingService.getSpecificReports(page, limit, startDate, endDate, currencyId , search ,sort , _id,2);
  if (result) {
    sendResponse(res, httpStatus.OK, result, null, "");
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to get data, please try again');
  }
});
const createReport = catchAsync(async (req, res) => {
  const _id = req.user ? req.user._id : null

  const {
    amount,
    dueDate,
    createdFor,
    currency
  } = await pick(req.body, [
    "amount",
    "dueDate",
    "createdFor",
    'currency'
  ])

  const report = await getReportingService.addReport({
    amount,
    dueDate,
    createdBy: _id,
    createdFor,
    currency
  });

  if (report) {
    sendResponse(res, httpStatus.OK, { msg: "Invoice Created Successfully", report }, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg: 'Something went wrong' });
  }
});

const getMyReportById = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ['id'])
  const userId = req.user ? req.user._id : null

  const report = await getReportingService.getReportById(id, userId);
  if (report) {
    sendResponse(res, httpStatus.OK, report, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg: 'Not able to Get report' });
  }
});

const updateMyReportById = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ['id'])
  const userId = req.user ? req.user._id : null

  const report = await getReportingService.updateReportStatusById(id, req.body, userId);
  if (report) {
    sendResponse(res, httpStatus.OK, report, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg: 'Not able to Get report' });
  }
});

const deleteMyReport = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ['id'])
  const userId = req.user ? req.user._id : null

  const report = await getReportingService.deleteReportById(id, userId);
  if (report) {
    sendResponse(res, httpStatus.OK, "Report Deleted successfully!", null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to delete Report');
  }
});

module.exports = {
  getReports,
  createReportingData,
  getReportById,
  deleteReport,
  pastDueReports,
  unPaidReports,
  getPaidReports,
  updateReportById,
  getMyReports,
  deleteMyReport,
  updateMyReportById,
  getMyReportById
  , createReport,
  myPastDueReports,
  myUnPaidReports,
  getMyPaidReports
};