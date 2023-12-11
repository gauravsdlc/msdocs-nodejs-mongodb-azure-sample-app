
const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { deleteAPIkey} = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const deleteApiKey = catchAsync(async (req, res) => {
    let {user} = await pick(req, ['user']);
    const { apiKey } = await pick(req.params, ['apiKey']);  
  
    const result = await deleteAPIkey(user.orgId,apiKey);
    if (result) {
      sendResponse(res, httpStatus.OK, result, null);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to delete api key, please try again');
    }
  });
  
module.exports =  deleteApiKey