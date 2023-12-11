const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be valid mail`,
    }),
    password: Joi.string().required().custom(password).messages({
      "string.empty": `Password must contain value`,
      "any.required": `Password is a required field`
    }),
    fName: Joi.string().required().messages({
      "string.empty": `First name must contain value`,
      "any.required": `First name is a required field`
    }),
    lName: Joi.string(),
    username: Joi.string().required().messages({
      "string.empty": `Username must contain value`,
      "any.required": `Username is a required field`
    }),
    role: Joi.string().required(),
    referralCode:Joi.string()
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().allow("").required(),
    password: Joi.string().required(),
    phoneNumber:Joi.string().allow("").required()
  }),
};

const adminLoginWithEmail = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const adminLoginWithMembershipId = {
  body: Joi.object().keys({
    membershipId: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const resetPasswordValidation = {
  body: Joi.object().keys({
    password: Joi.string().required(),
    token: Joi.string().required(),
  }),
};

const changePasswordValidation = {
  body: Joi.object().keys({
    // email: Joi.string().required(),
    newPassword: Joi.string().required(),
    currentPassword: Joi.string().required(),
  }),
};

const forgotPasswordValidation = {
  body: Joi.object().keys({
    email: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const socialLogin = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  resetPasswordValidation,
  socialLogin,
  adminLoginWithEmail,
  adminLoginWithMembershipId,
  forgotPasswordValidation,
  changePasswordValidation
};
