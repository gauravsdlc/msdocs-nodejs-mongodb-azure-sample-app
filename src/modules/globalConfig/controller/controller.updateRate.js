const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const { updateRate, getCurrentUSDRate } = require("../../../contract");
const pick = require("../../../utils/pick");
const OrgModel = require('../../orgDetails/orgDetails.model')

const updateConversionRate = catchAsync(async (req, res) => {
    const { rate } = await pick(req.body, ["rate"]);
    
    try {
        let result = await updateRate(rate)
        if(result.hash){
            await OrgModel.updateMany({active: true}, {$set: {conversionRate: Number(rate)}})
        }
        sendResponse(res, httpStatus.OK, result, null)
    } catch (error) {
        console.error("updateConversionRate ::", error);
        sendResponse(res, httpStatus.BAD_GATEWAY, null, error.message)
    }
});

module.exports = updateConversionRate;
