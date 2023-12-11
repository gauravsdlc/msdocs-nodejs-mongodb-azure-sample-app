const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const { updateRate, getCurrentUSDRate } = require("../../../contract");
const pick = require("../../../utils/pick");

const getRate = catchAsync(async (req, res) => {
    try {
        let rate = await getCurrentUSDRate()
        sendResponse(res, httpStatus.OK, rate, null)
    } catch (error) {
        console.error("getRate ::", error);
        sendResponse(res, httpStatus.BAD_GATEWAY, null, error.message)
    }
});

module.exports = getRate;
