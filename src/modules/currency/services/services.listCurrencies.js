const httpStatus = require('http-status');
const mongoose = require('mongoose');
const OrgDetails = require('../../orgDetails/orgDetails.model.js');
const  Currency  = require('../currency.model.js');
/**
 * Create a Currency
 * @param {Object} CurrencyData
 * @returns {Promise<Currency>}
 */
const listCurrencies = async (options, filter ,showOnlyActive=false) => {
    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;
    var filterQuery = {...filter,active:true};
    if(showOnlyActive){
      filterQuery={...filterQuery,inActive:false}
    }
    let aggregateQuery = [
      {
        $match: filterQuery
      }
    ]
    const listResult = await Currency.aggregate(aggregateQuery).sort({ _id: -1 }).skip(skip).limit(limit)
  
    const totalResults = await Currency.countDocuments({ active: true });
    const totalPages = Math.ceil(totalResults / limit);
  
    const filteredCount = listResult.length;
    return { results: listResult, totalResults, totalPages, page, limit, filteredCount };
  }
module.exports = listCurrencies