const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, authService } = require('../services');
const { sendResponse } = require('../utils/responseHandler');
const UserModel = require("../models/user.model")
const generatePassword = require('../utils/generatePassword');
const { default: isEmail } = require('validator/lib/isEmail');
const OrgDetails = require('../modules/orgDetails/orgDetails.model');

const createOrganization = catchAsync(async (req, res) => {
  const isEmailTaken = await UserModel.isEmailTaken(req.body.email)
  if (isEmailTaken) {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Email already taken');
    return
  }
  const orgEmailTaken = await OrgDetails.isEmailTaken(req.body.orgEmail)
  if (orgEmailTaken) {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Organization Email is already taken');
    return
  }
  const {
    name,
    email,
    profileUrl,
    orgname,
    desc,
    commission,
    primaryCurrency,
    supportedCurrency,
    agreementDocuments,
    otherDocuments,
    orgEmail,
    password,



  } = await pick(req.body, [
    "name",
    "email",
    "profileUrl",
    "orgname",
    "desc",
    "commission",
    "primaryCurrency",
    "supportedCurrency",
    "agreementDocuments",
    "otherDocuments",
    "orgEmail",
    "password"
  ])
  const role = "orgAdmin"
  const user = await userService.createOrganization({
    name,
    email,
    orgEmail,
    profileUrl,
    orgname,
    desc,
    commission,
    primaryCurrency,
    supportedCurrency,
    agreementDocuments,
    otherDocuments,
    password,
    role: role
  });

  if (user) {
    sendResponse(res, httpStatus.OK, { msg: "Organization Created Successfully", user }, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Something went wrong');
  }
});
const resetPassword = catchAsync(async (req, res) => {
  // const {}=await pick(req.query,["token"]);
  const {token,password}=await pick(req.body,["token","password"])

  if(token==="\"\""){
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Empty token not allowed!');
  }
  const response = await authService.resetPassword(token, password);
  if (response) {
    if (!response.error) {
      sendResponse(res, httpStatus.OK, response, null);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, response.error, null);
    }
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Password Reset Failed');
  }
});
const updateOrganization = catchAsync(async (req, res) => {

  if(req.body.email){
    const isEmailTaken = await UserModel.isEmailTaken(req.body.email,req.body.organizationId)
    if ( isEmailTaken) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, 'Email already taken');
      return
    }
  }
  if(req.body.orgEmail){
    const orgEmailTaken = await OrgDetails.isEmailTaken(req.body.orgEmail,req.body.organizationId)
    if (orgEmailTaken) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, 'Organization Email is already taken');
      return
    }
  }
  const user = await userService.updateOrganization(req.body);
  if (user) {
    sendResponse(res, httpStatus.OK, { msg: "User Updated Successfully", user }, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null,{msg: 'Org not found!'});
  }
});
const updateOrgDetails = catchAsync(async (req, res) => {
  const { organizationId } = await pick(req.body, ["organizationId"])

  // if(email){
  //   const orgEmailTaken = await OrgDetails.isEmailTaken(email,organizationId)
  //   if (orgEmailTaken) {
  //     sendResponse(res, httpStatus.BAD_REQUEST, null, 'Organization Email is already taken');
  //     return
  //   }
  // }
  const org = await userService.updateOrgDetails(req.body,organizationId);
  if (org) {
    sendResponse(res, httpStatus.OK, { msg: "Org Updated Successfully", org }, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null,{msg: 'Org not found!'});
  }
});

const updateConversationRate = catchAsync(async (req, res) => {
  const {rate}=await pick(req.body,["rate"])
  const org = await userService.updateConversationRate(rate, req.user.orgId);
  if (org) {
    sendResponse(res, httpStatus.OK, { msg: "Org Updated Successfully", org }, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null,{msg: 'Org not found!'});
  }
});

const deleteSupportedCurrencyId = catchAsync(async (req, res) => {
  const {orgId}=await pick(req.params, ['orgId']);
  const {organizationId,currencyId}=await pick(req.body, ['organizationId','currencyId']);

  const org = await userService.deleteSupportedCurrency(orgId,currencyId,organizationId);
  if (org) {
    sendResponse(res, httpStatus.OK, { msg: "Suported Currency Deleted Successfully", org }, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null,{msg: 'Org not found!'});
  }
});
const listSupportedCurrencies = catchAsync(async (req, res) => {
  const { organizationId } = await pick(req.params, ['organizationId']);
  console.log("organizationId::",organizationId);
  const fetchedCurrencies = await userService.getCurrencyByOrgId(organizationId);
  if (fetchedCurrencies) {
    sendResponse(res, httpStatus.OK, fetchedCurrencies, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not Able to fetch organization !');
  }
});
const listOnlyActiveSupportedCurrencies = catchAsync(async (req, res) => {
  const { orgId } = await pick(req.params, ['orgId']);
  const fetchedCurrencies = await userService.getCurrencyByOrgId(orgId,true);
  if (fetchedCurrencies) {
    sendResponse(res, httpStatus.OK, fetchedCurrencies, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not Able to fetch organization !');
  }
});

const getOrgById = catchAsync(async (req, res) => {
  const { organizationId } = await pick(req.params, ['organizationId']);
  const fetchedOrganization = await userService.getOrgById(organizationId);
  if (fetchedOrganization) {
    sendResponse(res, httpStatus.OK, fetchedOrganization, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not Able to fetch organization !');
  }
});

const listOrganization = catchAsync(async (req, res) => {
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
  const list = await userService.listOrganization(page, limit, startDate, endDate , search ,sort);
  if (list) {
    sendResponse(res, httpStatus.OK, list, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to get Collections, please try again');
  }
});
const deleteOrganization = catchAsync(async (req, res) => {
  const { organizationId } = await pick(req.params, ['organizationId']);

  const removedOrg = await userService.removeOrgById(organizationId);
  if (removedOrg) {
    sendResponse(res, httpStatus.OK, {msg:removedOrg}, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null,  {msg:'Not able to delete organization'});
  }
});

const changeUserStatusById = catchAsync(async (req, res) => {
  const { userId } = await pick(req.params, ['userId']);
  const { status } = await pick(req.body, ['status']);

  const fetchedOrganization = await userService.changeUserStatus(userId,status);
  if (fetchedOrganization) {
    sendResponse(res, httpStatus.OK, {msg:"User Status changed!"}, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not Able to fetch organization !');
  }
});

const getAllOrganizations = catchAsync(async (req, res) => {
  let {filter, options} = await pick(req.body, ['filter', 'options']);

  const list = await userService.getAllOrganizations(filter, options);
  if (list) {
    sendResponse(res, httpStatus.OK, list, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to get Organizations, please try again');
  }
});


module.exports = {
  updateConversationRate,
  createOrganization,
  getOrgById,
  deleteOrganization,
  listOrganization,
  updateOrganization,
  listSupportedCurrencies,
  listOnlyActiveSupportedCurrencies,
  updateOrgDetails,
  resetPassword,
  changeUserStatusById,
  deleteSupportedCurrencyId,
  getAllOrganizations,

};
