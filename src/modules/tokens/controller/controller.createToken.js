const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { addToken} = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const createToken = catchAsync(async (req, res) => {

  const {
    orgId,
    amount,
    from,
    trnxHash,
    walletAddress
  } = await pick(req.body, [
    "orgId",
    "amount",
    "from",
    "trnxHash",
    "walletAddress"
  ])
  const Token = await addToken({orgId , amount, from , trnxHash,walletAddress});

  if (Token) {
    sendResponse(res, httpStatus.OK, { msg: "Token added Successfully", Token }, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, { msg: 'Something went wrong'});
  }
});


module.exports = createToken