const httpStatus = require('http-status');
const mongoose = require('mongoose');
const Tokens = require('../tokens.model.js');
const OrgDetails = require('../../orgDetails/orgDetails.model.js');
const TokenHistory = require('../tokens.model.js');

const getTokenHistoryService = async (orgId, options, filter) => {

    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;
    var filterQuery = { ...filter, active: true, orgId: mongoose.Types.ObjectId(orgId) };

    let aggregateQuery = [
        {
            $match: filterQuery
        }
    ]
    const listResult = await TokenHistory.aggregate(aggregateQuery).sort({ _id: -1 }).skip(skip).limit(limit)

    const totalResults = await TokenHistory.countDocuments({ active: true });
    const totalPages = Math.ceil(totalResults / limit);

    const filteredCount = listResult.length;
    return { results: listResult, totalResults, totalPages, page, limit, filteredCount };
}
module.exports = getTokenHistoryService