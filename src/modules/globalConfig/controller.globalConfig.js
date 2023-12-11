const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const {GlobalConfig} = require('./model.globalConfig')
const { sendResponse } = require('../../utils/responseHandler');
const globalConfigService  = require('./services/index');

const addGlobalConfig = catchAsync(async (req, res) => {
  console.log("add addGlobalConfig :-- ",req.body);

  const insertResult = await globalConfigService.addGlobalConfig({ ...req.body });

    if (insertResult) {
        sendResponse(res, httpStatus.OK, insertResult, null, "Insert Success");
    } else {
        sendResponse(res, httpStatus.BAD_REQUEST, null, 'Not able to create collection, please try again');
    }
});
    
const updateGlobalConfig = catchAsync(async (req, res) => {
    const reqBody = req.body;
    const { _id } = await pick(req.params, ['_id']);
    const updatedGCUserReward = await globalConfigService.updateGlobalConfig(_id, reqBody);
    if (updatedGCUserReward) {
        sendResponse(res, httpStatus.OK, updatedGCUserReward, null);
    } else {
        sendResponse(res, httpStatus.BAD_REQUEST, null, 'GlobalConfig record not found !');
    }
});
  
const getGlobalConfig = catchAsync(async (req, res) => {
    
    const result = await GlobalConfig.findOne(); //.exec()
    console.log(result);
      
    try {
        if (result) {
            sendResponse(res, httpStatus.OK, result, null);
        }
    } catch (error) {
        sendResponse(res, httpStatus.BAD_REQUEST, null, 'Cannot Get record');
        console.log(error);
    }
});

module.exports = {addGlobalConfig, getGlobalConfig, updateGlobalConfig};