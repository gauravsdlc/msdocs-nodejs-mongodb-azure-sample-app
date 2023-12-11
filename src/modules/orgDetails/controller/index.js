const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const userService = require('../services/index');
const { sendResponse } = require('../../../utils/responseHandler');


const listOrganization = catchAsync(async (req, res) => {
  console.log("req ", req.user);
   
    const list = await userService.listOrganization();
    if (list) {
      sendResponse(res, httpStatus.OK, list, null);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to get Collections, please try again');
    }
  });


  
module.exports = {
    listOrganization,
  };