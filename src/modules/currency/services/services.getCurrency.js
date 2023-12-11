const httpStatus = require('http-status');
const mongoose = require('mongoose');
const OrgDetails = require('../../orgDetails/orgDetails.model.js');
const  Currency  = require('../currency.model.js');
/**
 * Create a Currency
 * @param {Object} CurrencyData
 * @returns {Promise<Currency>}
 */
const getCurrency = async (id,showOnlyActive=false) => {
  var filterQuery = {active:true,_id:mongoose.Types.ObjectId(id)};
  if(showOnlyActive){
    filterQuery={...filterQuery,inActive:false}
  }
 const currency = await Currency.find(filterQuery);

 return currency;
};
module.exports = getCurrency