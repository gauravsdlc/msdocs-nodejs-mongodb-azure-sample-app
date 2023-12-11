const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { totalTokens } = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const { getTokenHistoryService } = require('../services/index');

const getTokenHistoryByOrgId = catchAsync(async (req, res) => {
    let options = req.body.options || {};
    let filter = req.body.filter || {}
  
    const { orgId } = await pick(req.params, ["orgId"])
  
    const list = await getTokenHistoryService(orgId, options, filter);
    if (list) {
      sendResponse(res, httpStatus.OK, list, null);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, { msg: 'Not able to get Token, please try again' });
    }
  });

module.exports = getTokenHistoryByOrgId