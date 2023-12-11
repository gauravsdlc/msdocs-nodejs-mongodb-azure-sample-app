const httpStatus = require('http-status');
const mongoose = require('mongoose');
const OrgDetails = require('../../orgDetails/orgDetails.model.js');
const  Currency  = require('../currency.model.js');
/**
 * Create a Currency
 * @param {Object} CurrencyData
 * @returns {Promise<Currency>}
 */
const listMyCurrencies = async (options, filter,orgId) => {
  const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
  const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
  const skip = (page - 1) * limit;
  
  let suportedCurrencies=await OrgDetails.find({active:true,_id:mongoose.Types.ObjectId(orgId)},{supportedCurrency:1})
  var filterQuery = {...filter,active:true}
  if(suportedCurrencies.length>0){

    suportedCurrencies=suportedCurrencies[0].supportedCurrency.map((item)=>mongoose.Types.ObjectId(item))
    filterQuery = {...filterQuery,_id:{$in:suportedCurrencies}};
  }
  else{
    filterQuery = {...filterQuery,_id:{$in:[]}};
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
module.exports = listMyCurrencies