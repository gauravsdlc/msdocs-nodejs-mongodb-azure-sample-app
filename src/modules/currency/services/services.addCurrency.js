const httpStatus = require('http-status');
const mongoose = require('mongoose');
const OrgDetails = require('../../orgDetails/orgDetails.model.js');
const  Currency  = require('../currency.model.js');
/**
 * Create a Currency
 * @param {Object} CurrencyData
 * @returns {Promise<Currency>}
 */
const addCurrency = async (currencyData) => {
  const currency = await Currency.create(currencyData);

  return currency;
};
module.exports = addCurrency