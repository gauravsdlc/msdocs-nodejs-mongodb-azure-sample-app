const httpStatus = require('http-status');
const mongoose = require('mongoose');
const multiChainWallet = require('multichain-crypto-wallet');
const { User, APIKey } = require('../models');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/responseHandler');
const OrgDetailsModel = require('../modules/orgDetails/orgDetails.model');
const OrgDetails = require('../modules/orgDetails/orgDetails.model');
const Currency = require('../modules/currency/currency.model');
const { orgWelcomeEmail } = require('../utils/emailservice');
const { sendMail, sendWelcomeMail } = require('../utils/sendMail');
const tokenService = require('../services/token.service');
const { v5 } = require('uuid');
const CryptoWalletHelper = require('../utils/cryptoWalletHelper');
const { createOrganizationBlockchain } = require('../../scripts/fils_hardhat');

/**
 * Create a user
 * @param {Object} organizationData
 * @returns {Promise<User>}
 */
const createOrganization = async (organizationData, res) => {
  if (organizationData.orgname) {
    // here only name is applicable as of now
    var searchRegex = new RegExp(`.*${organizationData.orgname}.*`, "i")
    let isOrgNameTakenQuery = { name: { $regex: searchRegex } }
    let isOrgNameTaken = await OrgDetails.findOne(isOrgNameTakenQuery)

    if (isOrgNameTaken) {
      throw new Error(`Organization name is already taken`);
    }
  }

  const orgDetails = await addOrgDetails(organizationData)

  if (orgDetails) {
    const userDetails = { name: organizationData.name, email: organizationData.email, password: organizationData.password, profileUrl: organizationData.profileUrl, role: organizationData.role, organizationId: orgDetails.organizationId, orgId: orgDetails._id }
    let user = await User.create(userDetails);
    const { resetPasswordToken } = await tokenService.generateResetPasswordToken(user.email)
    await sendWelcomeMail(user, resetPasswordToken)
    return user
  }
  return null;
};

const updateOrganization = async (organizationData) => {
  if (organizationData.orgname) {
    // here only name is applicable as of now
    var searchRegex = new RegExp(`.*${organizationData.orgname}.*`, "i")
    let isOrgNameTakenQuery = { name: { $regex: searchRegex } }
    let isOrgNameTaken = await OrgDetails.findOne(isOrgNameTakenQuery)

    if (isOrgNameTaken) {
      throw new Error(`Organization name is already taken`);
    }
  }
  const organizationId = organizationData.organizationId;
  delete organizationData.organizationId;
  const user = await User.findOneAndUpdate({ organizationId }, organizationData);

  if (user) {
    const orgDetails = await updateOrgDetails(organizationData, organizationId)

  }

  return user;
};

const removeOrgById = async (organizationId) => {
  // Find the organization with the given organizationId
  const existingOrg = await User.findOne({ organizationId });

  if (existingOrg) {
    // Toggle the 'active' value
    const updatedActive = !existingOrg.active;

    // Update the 'active' value for the existing organization in the User collection
    await User.updateOne({ organizationId }, { $set: { active: updatedActive } });
  }
  // Update the 'active' value for OrgDetails (if necessary)
  const orgDetails = await OrgDetails.findOne({ organizationId: organizationId });
  if (orgDetails) {
    // Toggle the 'active' value for OrgDetails
    const updatedActive = !orgDetails.active;
    await OrgDetails.updateOne({ organizationId }, { $set: { active: updatedActive } });
  }

  return { data: `user is now ${!existingOrg?.active}` };
};

const getOrgById = async (organizationId) => {
  var filterQuery = { organizationId, role: 'orgAdmin', active: true };

  let aggregateQuery = [
    {
      $match: filterQuery
    },
    {
      $lookup: {
        from: 'orgdetails',
        localField: 'orgId',
        foreignField: '_id',
        as: 'orgDetails'
      }
    },
    {
      $unwind: { path: '$orgDetails', preserveNullAndEmptyArrays: true }
    },
    {
      $lookup: {
        from: 'currencies',
        localField: 'orgDetails.primaryCurrency',
        foreignField: '_id',
        as: 'currencyDetails'
      }
    }
  ]
  const fetchResult = await User.aggregate(aggregateQuery);
  return fetchResult;
}

const getUserByOrgId = async (orgId) => {
  var filterQuery = { _id: mongoose.Types.ObjectId(orgId), role: 'orgAdmin', active: true };
  const fetchResult = await User.findOne(filterQuery);
  return fetchResult;
}

const getCurrencyByOrgId = async (organizationId, showInActive = false) => {
  let getOrgSearchQuery = { organizationId, active: true }

  let aggregateQuery = [
    {
      $match: getOrgSearchQuery
    },

  ]
  const fetchResult = await OrgDetails.aggregate(aggregateQuery);
  console.log("result from backedn", fetchResult);
  let currencyResult = []
  if (fetchResult.length > 0) {
    const currencyIdArray = fetchResult[0].supportedCurrency.map((id) => mongoose.Types.ObjectId(id))
    let getOrgSearchQuery2 = { _id: { $in: currencyIdArray }, active: true }
    if (showInActive) {
      getOrgSearchQuery2 = { ...getOrgSearchQuery2, inActive: false }
    }
    currencyResult = await Currency.find(getOrgSearchQuery2)
  }
  return currencyResult;
}


const listOrganization = async (page = 1, limit = 10, startDate, endDate, search, sort = -1) => {
  const skip = (page - 1) * limit;
  var filterQuery = { active: true };
  let parseFilter = { startDate, endDate }
  let orgQuery = {}

  if (parseFilter.startDate && parseFilter.endDate) {
    const startDate = new Date(parseFilter.startDate)
    let endDate = new Date(parseFilter.endDate)
    endDate.setHours(23)
    endDate.setMinutes(59)
    endDate.setSeconds(59)
    parseFilter = { ...parseFilter, createdAt: { $gte: startDate, $lt: endDate } }
    delete parseFilter.startDate
    delete parseFilter.endDate
  }
  filterQuery = { ...filterQuery, ...parseFilter };

  let aggregateQuery = [
    {
      $match: filterQuery
    },
    {
      $lookup: {
        from: 'orgdetails',
        localField: 'orgId',
        foreignField: '_id',
        as: 'orgDetails',
      }
    },
    {
      $unwind: { path: '$orgDetails', preserveNullAndEmptyArrays: true }
    },

    {
      $addFields: {
        "orgName": "$orgDetails.name",
      }
    },
  ]
  if (search && search != "") {
    var searchRegex = new RegExp(`.*${search}.*`, "i")
    searchQuery = {
      $or: [
        { orgName: { $regex: searchRegex } },
      ]
    }
    aggregateQuery.push({ $match: searchQuery });
  }
  const listResult = await User.aggregate(aggregateQuery).sort({ _id: sort }).skip(skip).limit(limit)

  const totalResults = await User.countDocuments({ active: true });
  const totalPages = Math.ceil(totalResults / limit);

  const filteredCount = listResult.length;
  console.log("list result::", listResult);
  return { results: listResult, totalResults, totalPages, page, limit, filteredCount };
}

const addOrgDetails = async (organizationData) => {

  let orgDetailsData = {
    email: organizationData.orgEmail,
    name: organizationData.orgname,
    desc: organizationData.desc,
    agreementDocuments: organizationData.agreementDocuments,
    otherDocuments: organizationData.otherDocuments,
    primaryCurrency: organizationData?.primaryCurrency,
    supportedCurrency: organizationData.supportedCurrency,
    commission: organizationData.commission,

  }

  /* Create Wallet */
  try {
    const wallet = await CryptoWalletHelper.createWalletAndGetData(orgDetailsData)

    orgDetailsData["wallet"] = wallet
    let orgDetails = await OrgDetailsModel.create(orgDetailsData)// create org
    console.log("data::", orgDetails);
    createOrganizationBlockchain({ organizationId: Number(orgDetails.organizationId), orgName: orgDetails.name, walletAddr: wallet.address })
    return orgDetails
  } catch (error) {

  }

  return null
}
const updateOrgDetails = async (organizationData, organizationId) => {
  if (organizationData.name) {
    // here only name is applicable as of now
    var searchRegex = new RegExp(`.*${organizationData.orgName}.*`, "i")
    let isOrgNameTakenQuery = { name: { $regex: searchRegex }, organizationId: { $ne: organizationId } }
    let isOrgNameTaken = await OrgDetailsModel.findOne(isOrgNameTakenQuery)

    if (isOrgNameTaken) {
      throw new Error(`Organization name is already taken`);
    }
  }
  let orgDetailFound = await OrgDetailsModel.findOne({ organizationId })
  var orgDetails
  if (orgDetailFound) {
    orgDetails = await OrgDetailsModel.updateOne({ organizationId: organizationData.organizationId },
      { name: organizationData?.orgName, 
        desc: organizationData?.desc, 
        primaryCurrency: organizationData?.primaryCurrency, 
        supportedCurrency: organizationData?.supportedCurrency,
        commission:organizationData?.commission
      })
    const user = await User.findOneAndUpdate({ organizationId: organizationData.organizationId }, { name: organizationData.name });
  }
  return orgDetailFound
}

const updateConversationRate = async (rate, orgId) => {
  /* Updated on Blockchain so no need to update in org */
  // await OrgDetailsModel.updateOne({ _id: mongoose.Types.ObjectId(orgId) }, {conversionRate: Number(rate) })
  return true
}

const deleteSupportedCurrency = async (userId, currencyId, organizationId) => {

  let orgDetailFound = await OrgDetailsModel.findOne({ userId: mongoose.Types.ObjectId(userId), organizationId })
  // take filtered array of supported currency
  console.log(orgDetailFound, "from me");

  const newArray = orgDetailFound.supportedCurrency.filter((item, i) => {
    if (String(currencyId) == String(item)) { return false; }
    return true;
  })
  orgDetailFound.supportedCurrency = newArray;
  if (orgDetailFound) {
    await OrgDetailsModel.updateOne({ userId: mongoose.Types.ObjectId(userId), organizationId }, orgDetailFound)
  }
  return orgDetailFound
}
const getUserByorganizationId = async (organizationId) => {
  // only orgAdmin role can login with organizationId
  const user = await User.findOne({ organizationId: organizationId, active: true, status: 1, role: { $in: ["org", "orgAdmin"] } })
  //TODO::change later, only orgAdmin can be logged in with organizationId
  if (user) return user
}
// new dev
const getOrgnizationByOrganizationId = async (organizationId) => {
  // only orgAdmin role can login with organizationId
  const orgnization = await OrgDetailsModel.findOne({ organizationId: organizationId, active: true, status: 1 })
    .select('name')
  //TODO::change later, only orgAdmin can be logged in with organizationId
  if (orgnization) return orgnization
}
//
const getUserByEmail = async (email) => {
  const user = await User.findOne({ email: email, active: true, status: 1 })
  if (user) return user
}

const changeUserStatus = async (id, status) => {
  let filterQuery = { _id: mongoose.Types.ObjectId(id), active: true }
  const changedStatus = await User.updateOne(filterQuery, { isActive: status })
  return changedStatus
};

const getAllOrganizations = async (filter, options) => {
  const limit =
    options.limit && parseInt(options.limit, 10) > 0
      ? parseInt(options.limit, 10)
      : 10;
  const page =
    options.page && parseInt(options.page, 10) > 0
      ? parseInt(options.page, 10)
      : 1;
  const skip = (page - 1) * limit;

  let filterQuery = { $and: [{ role: "orgAdmin", }] };

  if (filter.startDate && filter.endDate) {
    const startDate = new Date(filter.startDate)
    let endDate = new Date(filter.endDate)
    endDate.setHours(23, 59, 59, 59)
    filterQuery = { ...filterQuery, createdAt: { $gte: startDate, $lt: endDate } }
  }

  let aggregateQuery = [
    {
      $match: filterQuery,
    },

    {
      $lookup: {
        from: 'orgdetails',
        localField: 'orgId',
        foreignField: '_id',
        as: 'orgDetails'
      }
    },
    {
      $lookup: {
        from: 'currencies',
        localField: '_id',
        foreignField: 'primaryCurrency',
        as: 'primaryCurrency'
      }
    },
    {
      $unwind: { path: '$orgDetails', preserveNullAndEmptyArrays: true }
    },
    {
      $unwind: { path: '$primaryCurrency', preserveNullAndEmptyArrays: true }
    },
    {
      $addFields: {
        "orgName": "$orgDetails.name",
      }
    },
    {
      $project: {
        password: 0,
        createdAt: 0,
        updatedAt: 0,
        seqId: 0,
        // __v: 0,
        // _id: 0,
        // isActive:0
      }
    },
  ];
  if (filter.search) {
    var searchRegex = new RegExp(`.*${filter.search}.*`, "i")
    searchQuery = { "orgName": { $regex: searchRegex } }
    aggregateQuery.push({ $match: searchQuery })
  }
  const listResult = await User.aggregate(aggregateQuery)
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);


  for (let idx = 0; idx < listResult.length; idx++) {
    const docs = listResult[idx];
    let id = docs.orgDetails.primaryCurrency
    if (id) {
      let cur = await Currency.findById(id)
      docs["primaryCurrency"] = primaryCurrency = cur
    }
  }

  const totalResults = await User.countDocuments(filterQuery);
  const totalPages = Math.ceil(totalResults / limit);
  const totalCount = await User.countDocuments({ active: true, role: "orgAdmin", });

  return {
    results: listResult,
    totalResults,
    totalPages,
    page,
    limit,
    totalCount,
  };
};
function randomStringForUsername(text) {
  const MY_NAMESPACE = 'ac64bb4d-84dc-4e46-bee5-a29313515e29'
  var result = v5(text, MY_NAMESPACE);
  return result;
}


module.exports = {
  updateConversationRate,
  createOrganization,
  getUserByorganizationId,
  getUserByEmail,
  removeOrgById,
  getOrgById,
  listOrganization,
  updateOrganization,
  getCurrencyByOrgId,
  updateOrgDetails,
  changeUserStatus,
  deleteSupportedCurrency,
  getAllOrganizations,
  getOrgnizationByOrganizationId,
  getUserByOrgId
}
