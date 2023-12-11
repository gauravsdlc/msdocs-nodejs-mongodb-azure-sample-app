const httpStatus = require('http-status');
const mongoose = require('mongoose');
const OrgDetails = require('../../orgDetails/orgDetails.model.js');
const  Currency  = require('../currency.model.js');
/**
 * Create a Currency
 * @param {Object} CurrencyData
 * @returns {Promise<Currency>}
 */
const changeCurrencyStatus = async (id, status) => {
  const currency = await Currency.findOneAndUpdate({active:true,_id:mongoose.Types.ObjectId(id)},{inActive:status});

  return currency;
};
module.exports = changeCurrencyStatus