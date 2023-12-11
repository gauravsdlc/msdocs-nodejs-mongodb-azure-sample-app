
const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const mongoose = require('mongoose')
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/responseHandler');
const service = require('./points.service');
const { superAdminRole } = require('../../config/roles');

const getPoints = catchAsync(async (req, res) => {

  let { organizationId, startDate, endDate } = await pick(req.query,
    ["organizationId", "startDate", "endDate", "transferTo"])
  let incoming = false;
  if (req.user.role == superAdminRole) {
    incoming = true
  } else {
    organizationId = req.user.organizationId
  }

  let list = await service.getTotalPoints({ organizationId, incoming, startDate, endDate })
  sendResponse(res, httpStatus.OK, list, null);
});

const getLogs = catchAsync(async (req, res) => {

  let organizationId = (req.user.organizationId)
  if (req.user.role == superAdminRole) { // if superadmin is there
    ({ organizationId } = await pick(req.params, ['organizationId']))
  }
  let { page,
    limit, status,
    startDate, endDate } = await pick(req.query, ['page', 'limit', 'status', 'startDate',
      'endDate',])
  limit = limit > 10 ? limit : 10;
  page = page > 1 ? page : 1;
  let list = await service.getAllPointsByQuery(organizationId, page, limit, startDate, endDate, status)
  sendResponse(res, httpStatus.OK, list, null);
});

const getPointsForInvoiceGeneration = catchAsync(async (req, res) => {

  let organizationId = (req.user.organizationId)
  if (req.user.role == superAdminRole) { // if superadmin is there
    ({ organizationId } = await pick(req.query, ['organizationId']))
  }
  let {
    startDate, endDate } = await pick(req.query, ['startDate',
      'endDate',])

  let list = await service.getAllPointsForInvoiceGeneration(organizationId, startDate, endDate)
  sendResponse(res, httpStatus.OK, list, null);
});
const addPoints = catchAsync(async (req, res) => {

  const orgId= req.user.orgId
  const {
    refId,
    customerId,       
    amount,
    organizationId ,
    transferTo,
    currencyId,
    toCurrencyId
  } = await pick(req.body, ['refId','customerId', 'amount', 'organizationId','transferTo','currencyId', 'toCurrencyId']);

  const payload = {
    refId,
    customerId,       
    amount,
    organizationId: req.user.orgData.organizationId,
    transferTo,orgId,currencyId, toCurrencyId
  }

  let add = await service.addPoints(payload)
  if(add.data){
    sendResponse(res, httpStatus.OK, add.data._id, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, add.error);
  }
});
module.exports = {
  getPoints,
  getLogs,
  getPointsForInvoiceGeneration,
  addPoints

}
