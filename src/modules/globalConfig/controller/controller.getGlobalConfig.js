const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const {GlobalConfig} = require('../model.globalConfig')
const { sendResponse } = require('../../../utils/responseHandler');
const globalConfigService  = require('../services/index');

const getGlobalConfig = catchAsync(async (req, res) => {
    
    const result = await GlobalConfig.findOne(); //.exec()
    try {
        if (result) {
            sendResponse(res, httpStatus.OK, result, null);
        }
    } catch (error) {
        sendResponse(res, httpStatus.BAD_REQUEST, null, 'Cannot Get record');
    }
});

module.exports = getGlobalConfig;