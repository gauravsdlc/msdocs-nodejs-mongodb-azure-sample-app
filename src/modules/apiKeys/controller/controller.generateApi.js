
const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { generateApiKey } = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const generateApi = catchAsync(async (req, res) => {
  const user = req.user
  
    const result = await generateApiKey({
      ...req.body, 
      organizationId: user.organizationId,
      orgId: user.orgId, 
      createdBy: user.id
    });
    
    if (result) {
      sendResponse(res, httpStatus.OK, result, null);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to generate API key, please try again');
    }
  });

module.exports =  generateApi
