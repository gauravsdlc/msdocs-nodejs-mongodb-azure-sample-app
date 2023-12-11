const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');
const { sendResponse } = require('../utils/responseHandler');
const pick = require('../utils/pick');
const { signUpWelcomeEmail } = require('../utils/emailservice');
const {getGlobalConfig} = require('../modules/globalConfig/services');
const { getCurrencyById } = require('../modules/currency/services');


function randomStringForUsername(length) {
  var result = '';
  var characters = '0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


const register = catchAsync(async (req, res) => {

  try {
    const { email, password, fName, lName, role, username } = req.body;
    let roleOfUser = role ? role : 'user';

    let userObj = {
      email,
      password,
      fName: fName,
      lName: lName,
      role: roleOfUser,
      username,
    };
    const isEmailAvailable = await userService.isEmailAvailable(req.body.email)
    if (isEmailAvailable) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, 'Email already taken');

    }

    const user = await userService.createUser(userObj);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
  } catch (error) {
    console.error("Error in registration", error);
  }

});
const adminHost = process.env.adminHost

const login = catchAsync(async (req, res) => {
  const { email, password, phoneNumber } = req.body;

  /* TODO : validate email; password */


  let reqOrigin = req.headers && req.headers.origin ? new URL(req.headers.origin) : ''
  let isAdmin = reqOrigin.host == adminHost
  // console.log("isAdmin::::", isAdmin)
  const user = await authService.loginUserWithEmailAndPassword(email, password, phoneNumber, isAdmin);
  const tokens = await tokenService.generateAuthTokens(user);

  sendResponse(res, httpStatus.OK, { user, tokens }, null);

});

const getCurrentUser = catchAsync(async (req, res) => {
  try {
    const { token } = req.body;
    const userRes = await authService.getCurrentUser(token);

    if (userRes.status) {
      res.status(httpStatus.OK).json({
        status: httpStatus.OK,
        data: { userData: userRes }
      });
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        data: 'something went wrong',
      });
    }
  } catch (err) {
    res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      data: 'Invalid token !',
    });
  }
});


const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const changePassword = catchAsync(async (req, res) => {
  const {currentPassword, newPassword } = await pick(req.body, ["currentPassword", "newPassword"])

  const response = await authService.changePassword( currentPassword, newPassword, req.user._id);
  if (response) {
    if (!response.error) {
      sendResponse(res, httpStatus.OK, response, null);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, response.error, null);
    }
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Password Change Failed');
  }
});

const resetPassword = catchAsync(async (req, res) => {
  const {password}=await pick(req.body,["password"])
  const {token}=await pick(req.body,["token"])

  const response = await authService.resetPassword(token,password);
  if(token===""){
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Empty token not allowed!');
  }
  if (response) {
    if (!response.error) {
      sendResponse(res, httpStatus.OK, response, null);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, response.error, null);
    }
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Password Reset Failed');
  }
});
const forgotPassword = catchAsync(async (req, res) => {
  const {email}=await pick(req.body,["email"])
  const response = await authService.forgotPassword(email);

  if (response) {
    if (!response.error) {
      sendResponse(res, httpStatus.OK, "Password Reset Link Successfully Sent", null);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, response.error, null);
    }
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Password Reset Failed');
  }
});
const adminLoginWithEmail = catchAsync(async (req, res) => {
  const { email, password } = await pick(req.body, ['email', 'password']);
  let user = await authService.adminLoginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  const walletAddress = process.env.ADMIN_WALLET;
  
  if (user.role === "suadmin") {
    user = { ...user._doc, walletAddress: walletAddress }; // Update user object with walletAddress
  }
  
  sendResponse(res, httpStatus.OK, { user, tokens }, null);
});



const adminLoginWithMembershipId = catchAsync(async (req, res) => {
  const { membershipId, password } = await pick(req.body, ['membershipId', 'password']);

  const user = await authService.adminLoginUserWithMembershipIdAndPassword(membershipId, password );
  const tokens = await tokenService.generateAuthTokens(user);
  sendResponse(res, httpStatus.OK, { user, tokens }, null);
});

/* DOC API */
const authApi = catchAsync(async (req, res) => {
  const {user} = await pick(req,["user"])

  const apiResult = await authService.authApi(user);
  if (apiResult) {
    sendResponse(res, httpStatus.OK,  apiResult , null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Unable to get api Key data');
  }
});
const getAuthorizedDetails = catchAsync(async (req, res) => {
  let { user } = await pick(req, ['user']);
  const result = await authService.getOrgName(user.orgId);
  let config = await getGlobalConfig()
  let primaryCurrency = await getCurrencyById(result.result._doc.primaryCurrency)
  
  if (result) {
    sendResponse(res, httpStatus.OK, {
      _id: user.orgData._id,
      organizationId: user.orgData.organizationId,
      ...result,
       config,
       primaryCurrency
    }, null);
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Unable to get User data');
  }
});
const adminLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.adminLoginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});
module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  getCurrentUser,
  resetPassword,
  changePassword,
  adminLoginWithEmail,
  adminLoginWithMembershipId,
  forgotPassword,
  randomStringForUsername,
  adminLogin,
  authApi,
  getAuthorizedDetails
};
