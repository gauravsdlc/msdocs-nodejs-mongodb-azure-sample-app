const Joi = require('joi');
const { password, objectId, endpointUrl } = require('./custom.validation');

const createOrganization = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    orgEmail: Joi.string().email().required(),
    password: Joi.string().custom(password).required(),
    name: Joi.string().required(),
    profileUrl: Joi.string().allow("").required(),
    password: Joi.string().required(),
    desc: Joi.string(),
    orgname: Joi.string().required(),
    agreementDocuments: Joi.array(),
    otherDocuments: Joi.array(),
    primaryCurrency: Joi.required(),
    supportedCurrency: Joi.array(),
    commission: Joi.number()
  }),
};
const updateOrganization = {
  // params: Joi.object().keys({
  //   organizationId:Joi.string().required()
  // }),
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    orgEmail: Joi.string().email(),
    password: Joi.string().custom(password),
    name: Joi.string(),
    profileUrl: Joi.string().allow(""),
    organizationId: Joi.string().required(),
    password: Joi.string(),
    desc: Joi.string(),
    orgname: Joi.string(),
    agreementDocuments: Joi.array(),
    otherDocuments: Joi.array(),
    currencyTypes: Joi.array(),
    commission: Joi.number()
  }),
};
const updateConversationRate = {
  body: Joi.object().keys({
    rate: Joi.number().required(),
  }),
}
const updateOrgDetails = {

  body: Joi.object().keys({
    organizationId: Joi.string().required(),
    name: Joi.string(),
    orgName: Joi.string(),
    desc: Joi.string(),
    status:Joi.number(),
    // email: Joi.string().email(),
    metadata: Joi.object(),
    primaryCurrency:Joi.custom(objectId),
    agreementDocuments: Joi.array(),
    otherDocuments: Joi.array(),
    supportedCurrency: Joi.array(),
    commission: Joi.number(),

  }),
};
const checkOrganizationId={
  params: Joi.object().keys({
    organizationId:Joi.string().required()
  }),
}
const checkOrgId={
  params: Joi.object().keys({
    orgId:Joi.custom(objectId).required()
  }),
}
const deleteSupportedCurrencyId={

  params: Joi.object().keys({
    orgId:Joi.custom(objectId).required(),
  }),
  body:Joi.object().keys({
    currencyId:Joi.custom(objectId).required(),
    organizationId: Joi.string().required(),
  })
}
const getOrganizationList = {

  query: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
    search: Joi.string(),
    startDate:Joi.date(),
    endDate:Joi.date(),
    sort:Joi.number()
}),
};
const resetPassword = {
  body: Joi.object().keys({
    password: Joi.string().required(),
    token: Joi.string().required(),
  }),
};
const updateUserStatus = {
  params: Joi.object().keys({
    userId:Joi.custom(objectId).required()
  }),
  body: Joi.object().keys({
    status: Joi.boolean().required()
  }),
}

const organizationList = {
  body: Joi.object().keys({
    filter: Joi.object().required(),
    options: Joi.object().required(),
  }),
};

const generateApiKey = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    endpointUrl: Joi.custom(endpointUrl),
    whitelist: Joi.array(),
  }),
};

const revealApiKey = {
  params: Joi.object().keys({
    apiKey:Joi.custom(objectId).required()
  }),
};

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    username: Joi.string().required(),
    password: Joi.string().required().custom(password),
    fName: Joi.string().required(),
    lName: Joi.string().required(),
    role: Joi.string().required().valid('writer', 'admin','user'),
    profilePic: Joi.string().allow(""),
    phoneNumber:Joi.string().allow(""),
    country:Joi.string().allow(""),
    bio:Joi.string().allow(""),
    
  }),
};
const listUsers = {
  body: Joi.object().keys({
    filter: Joi.object().required(),
    options: Joi.object().required(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};


const statusUser = {
  body: Joi.object().keys({
    status: Joi.string().required(),
    artistId: Joi.custom(objectId).required(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
     email: Joi.string().required().email(),
    username: Joi.string().required(),
    password: Joi.string().required().custom(password),
    fName: Joi.string().required(),
    lName: Joi.string().required(),
    role: Joi.string().required().valid('writer', 'admin','user',),
    profilePic: Joi.string().allow(""),
    phoneNumber:Joi.string().allow(""),
    country:Joi.string().allow(""),
    bio:Joi.string().allow(""),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  updateConversationRate,
  createOrganization,
  updateOrganization,
  getOrganizationList,
  checkOrgId,
  updateOrgDetails,
  resetPassword,
  updateUserStatus,
  deleteSupportedCurrencyId,
  organizationList,
  generateApiKey,
  revealApiKey,
  checkOrganizationId,
  createUser,
  listUsers,
  statusUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
