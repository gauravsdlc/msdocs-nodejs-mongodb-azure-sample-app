const httpStatus = require('http-status');
const mongoose = require('mongoose');
const OrgDetails = require('../../orgDetails/orgDetails.model.js');
const  Currency  = require('../currency.model.js');
/**
 * Create a Currency
 * @param {Object} CurrencyData
 * @returns {Promise<Currency>}
 */
const updateCurrencyById = async (id, data) => {
  
  const currency = await Currency.findOneAndUpdate({active:true,_id:mongoose.Types.ObjectId(id)},data);
  return currency;
  
};
module.exports = updateCurrencyById