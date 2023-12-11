const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addUser = {
  body: Joi.object().keys({
    status:Joi.string(),
    
    country:Joi.string().allow(""),
    role:Joi.string(),
    secondaryRoyalty: Joi.number(),
    primaryCommission: Joi.number(),
    phoneNumber: Joi.number().allow(""),
    email: Joi.string().required(),
    username: Joi.string().required(),
    address1: Joi.string().allow(""),
    address2: Joi.string().allow(""),
    city: Joi.string().allow(""),
    state: Joi.string().allow(""),
    password: Joi.string().allow(""),
    name: Joi.string().allow(""),
    coverLogo: Joi.string().allow(""),
    coverImage: Joi.string().allow(""),
    walletAddress: Joi.string().allow(""),
    bio:Joi.string().required(),
    wallet: Joi.object().keys({
      default: Joi.string().default(null),
      metamask: Joi.string().allow(null).allow(""),
      coinbase: Joi.string().allow(null).allow(""),
    }),
    postalCode:Joi.string().allow(""),
    coverBgColor:Joi.string(),
    pageBgColor:Joi.string(),
    coverDescBgColor:Joi.string(),
    pageDescFontColor:Joi.string()
  }),
};




const listUsers = {
  body: Joi.object().keys({
    filter: Joi.object().required(),
    options: Joi.object().required(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

const approveUser = {
  body: Joi.object().keys({
    userId: Joi.custom(objectId).required(),
    status: Joi.string().required(),
  }),
};

const deleteUser = {
  body: Joi.object().keys({
    userId: Joi.custom(objectId).required(),
  }),
};

const checkUsername = {
  body: Joi.object().keys({
    username: Joi.string().required(),
  }),
};

module.exports = {
  addUser,
  listUsers,
  approveUser,
  getUser,
  checkUsername,
  deleteUser,
};
