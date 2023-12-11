const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const {GlobalConfig} = require('../model.globalConfig')
const { sendResponse } = require('../../../utils/responseHandler');
const globalConfigService  = require('../services/index');
const ApiError = require('../../../utils/ApiError');

const addGlobalConfig = catchAsync(async (req, res) => {
  console.log("add addGlobalConfig :-- ",req.body);

    try {    
        const insertResult = await globalConfigService.addGlobalConfig({ ...req.body });
        if (insertResult) {
            sendResponse(res, httpStatus.OK, insertResult, null, "Insert Success");
        } else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to create collection, please try again');
        }
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST ,error.message);
    }
});
module.exports = addGlobalConfig;
