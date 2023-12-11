const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const {GlobalConfig} = require('../model.globalConfig')
const { sendResponse } = require('../../../utils/responseHandler');
const globalConfigService  = require('../services/index');
const ApiError = require('../../../utils/ApiError');

const updateGlobalConfig = catchAsync(async (req, res) => {
    try {
        const reqBody = req.body;
        const { _id } = await pick(req.params, ['_id']);
        const updatedGCUserReward = await globalConfigService.updateGlobalConfig(_id, reqBody);
        if (updatedGCUserReward) {
            sendResponse(res, httpStatus.OK, updatedGCUserReward, null);
        } else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, 'GlobalConfig record not found !');
        }
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST ,error.message);
    }
});
module.exports = updateGlobalConfig;