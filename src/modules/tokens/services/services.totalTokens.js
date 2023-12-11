const httpStatus = require('http-status');
const mongoose = require('mongoose');
const  Tokens  = require('../tokens.model.js');
const { getOrgById } = require('../../../services/user.service.js');
const { getBalance } = require('../../../utils/cryptoWalletHelper.js');
const { getTokenBalance } = require('../../../../scripts/fils_hardhat.js');
const OrgDetails = require('../../orgDetails/orgDetails.model.js');

const getTotalTokensByOrgId = async (orgId) => {

  let data = await  OrgDetails.find({organizationId:String(orgId),  active: true});
  let walletBalance = await getTokenBalance(data[0]?.wallet?.address)
    
    return { balance: walletBalance };
}
module.exports = getTotalTokensByOrgId