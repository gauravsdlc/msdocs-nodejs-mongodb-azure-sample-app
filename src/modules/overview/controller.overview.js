const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/responseHandler');
const getOverviewService = require('./service.overview');
const { roles } = require('../../config/roles');

const getOverviewDataForOrg = catchAsync(async (req, res) => {
  const {
    orgId
  } = await pick(req.params, [
    "orgId"
  ])

  // console.log("Token",req.user.organizationId);
  if (req.user.role != roles[0] && req.user.orgId!=orgId) { //orgAdmin is there, and accessing someone else data
    sendResponse(res, httpStatus.FORBIDDEN, null,  "UnAuthorized for this orgId"  );
    return
  }
  let result = await getOverviewService.getOverviewData(orgId,req.user.organizationId);

  if (result) {
    sendResponse(res, httpStatus.OK, result, null, "");
  }  else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to get Overview data, please try again');
  }
});


module.exports = { getOverviewDataForOrg };