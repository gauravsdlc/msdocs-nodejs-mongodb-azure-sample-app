const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { adminRoles } = require('../config/roles');
const { storePassword } = require('./password.services');


const OrgDetails = require('../modules/orgDetails/orgDetails.model');
const APIKEY = require('../modules/apiKeys/apiKey.model');
const getGlobalConfig = require('../modules/globalConfig/services/services.getGlobalConfig');
const Currency = require("../modules/currency/currency.model")



/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const adminLoginUserWithEmailAndPassword = async (email, password) => {

    const user = await userService.getUserByEmail(email)

    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    if (user && !adminRoles.includes(user.role)) throw new ApiError(httpStatus.UNAUTHORIZED, 'User is not authorized');
    return user;
  };


/**
 * Login with membershipId and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const adminLoginUserWithMembershipIdAndPassword = async (membershipId, password ) => {


       let  user = await userService.getUserByorganizationId(membershipId)
    const  orgObj = await userService.getOrgnizationByOrganizationId(membershipId)

    if (!user || !(await user.isPasswordMatch(password)) || user.role!='orgAdmin') {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    if (user && !adminRoles.includes(user.role)) throw new ApiError(httpStatus.UNAUTHORIZED, 'User is not authorized');

      user._doc.orgData = orgObj

    return user;
  };

const resetPassword = async (resetPasswordToken, newPassword) => {
    try {
      const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);

      const user = await userService.getUserByOrgId(resetPasswordTokenDoc.user);
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }
      /* TODO : CHECK FOR EXPIRY */
      /* const newuser = await OTP.findOne({ userId: mongoose.Types.ObjectId(user._id), type: 'forget' }).sort({ createdAt: -1 });
         console.log('new user::', newuser) */
      if (user) {
        await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user._id), active: true }, { password: newPassword }, { new: true })
        
        //  await OTP.deleteOne({ user: mongoose.Types.ObjectId(user.id) });
        // // console.log(add123, '@@@@@@@@@@@@@@@@@@@@@@')
        return { message: "Password successfully reset" }
      } else {
        return { error: "Token verification Failed" }
      }
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
  };
const forgotPassword = async (email) => {
  const tokens = await tokenService.generateResetPasswordToken(email);
  // const tokens = await tokenService.generateAuthTokens(user);
    return tokens
  };

  const changePassword = async ( currentPassword, newPassword, loggedInUserId) => {
    try {
      const user = await User.findOne({_id:mongoose.Types.ObjectId(loggedInUserId), active:true})
      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
      }

      if (!(await user.isPasswordMatch(currentPassword))) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Incorrect password');
      }
      if (user) {
        let password = await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user._id), active: true }, { password: newPassword }, { new: true })
        
        let response = await storePassword(user._id, newPassword)
        if (response.status) {
          return "Password successfully changed"
        } else {
          return { error: response.message }
        }
      } else {
        return { error: "Failed to change password" }
      }
    } catch (error) {
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Password change failed '+error);
    }
  };

  /**
 * getCurrentUser
 * @param {string} username
 * @returns {Promise}
 */
const getCurrentUser = async (token) => {
  try {
    const { user } = await tokenService.verifyToken(token, 'refresh');
    const userData = await User.findOne({ _id: mongoose.Types.ObjectId(user), active: true });
    return userData;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'getCurrentUser failed');
  }
};
/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};



/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};


const authApi = async (data) => {
  try {
    var filterQuery = {active:true,_id:mongoose.Types.ObjectId(data['orgId'])};
    const result= await OrgDetails.findOne(filterQuery)
    return {apiData:data,orgData:result}
  } catch (error) {
    // throw new ApiError(httpStatus.NOT_FOUND, error);
  }
};

const getOrgName = async (organizationId) => {
  try {
    var filterQuery = {active:true,_id:mongoose.Types.ObjectId(organizationId)};
    let config = await getGlobalConfig()
    const result= await OrgDetails.findOne(filterQuery)

    return {
     result,

    }
  } catch (error) {
    // throw new ApiError(httpStatus.NOT_FOUND, error);
  }
};
module.exports = {
    adminLoginUserWithEmailAndPassword,
    adminLoginUserWithMembershipIdAndPassword,
    resetPassword,
    forgotPassword,
    getCurrentUser,
    changePassword,
    logout,
    refreshAuth,
    authApi,
    getOrgName
};
