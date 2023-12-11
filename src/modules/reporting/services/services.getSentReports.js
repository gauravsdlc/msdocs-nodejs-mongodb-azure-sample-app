const mongoose = require('mongoose');
const Report = require('../reporting.model');
const OrgDetails = require('../../orgDetails/orgDetails.model');

const getSentReports = async ({page = 1, limit = 10, startDate, endDate, currencyId, search, sort = -1, orgId, status}) => {
    
    const skip = (page - 1) * limit;
    const filterQuery = { active: true, invoiceGeneratedBy: mongoose.Types.ObjectId(orgId)};

    if(status || status == 0){
        filterQuery.status = status
    }
   
    if (startDate && endDate) {
        const _startDate = new Date(startDate)
        const _endDate = new Date(endDate)
        _endDate.setHours(23)
        _endDate.setMinutes(59)
        _endDate.setSeconds(59)
        
        filterQuery.createdAt = { $gte: new Date(_startDate.toISOString()), $lt: new Date(_endDate.toISOString()) }
    }
    
    let aggregateQuery = [
        {
            $match: filterQuery
        },
        {
            $lookup: {
                from: 'orgdetails',
                localField: 'invoiceGeneratedBy',
                foreignField: '_id',
                as: 'createrObj'
            }
        },
        
        {
            $lookup: {
                from: 'orgdetails',
                localField: 'invoiceGeneratedFor',
                foreignField: '_id',
                as: 'createdForObj'
            }
        },
        
        {
            $lookup: {
                from: 'currencies',
                localField: 'currency',
                foreignField: '_id',
                as: 'currencyObj'
            }
        },
        {
            $unwind: { path: '$currencyObj', preserveNullAndEmptyArrays: true }
        },
        {
            $addFields: {
                "createrObjName": "$createrObj.name",
                "createdForObjName": "$createdForObj.name",
            }
        },
    ]
    let searchQuery=null;
    if (search && search != "") {
        const searchRegex = new RegExp(`.*${search}.*`, "i")
        searchQuery = {
            $or: [
                // { createrObjName: { $regex: searchRegex } },
                { createdForObjName: { $regex: searchRegex } },
            ]
        }

        aggregateQuery.push({ $match: searchQuery });

    }

    let result = await Report.aggregate(aggregateQuery).sort({ _id: sort }).skip(skip).limit(limit)
    
    let totalResults 
    if (searchQuery) {
        totalResults = await Report.countDocuments({...filterQuery,...searchQuery});
    }else{
        totalResults = await Report.countDocuments(filterQuery);
    }

    const totalPages = Math.ceil(totalResults / limit);

    const filteredCount = result.length;
    return { results: result, totalResults, totalPages, page, limit, filteredCount };
}

module.exports = getSentReports;
