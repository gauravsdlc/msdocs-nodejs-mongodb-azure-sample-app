const mongoose = require('mongoose');
const Report = require('../reporting.model');

const getReports = async (page=1, limit=10, startDate, endDate, currencyId, search, sort =-1, orgId) => {
    const skip = (page - 1) * limit;
    var filterQuery = { active: true };
    let parseFilter = { startDate, endDate }

    if (parseFilter.startDate && parseFilter.endDate) {
        const startDate = new Date(parseFilter.startDate)
        let endDate = new Date(parseFilter.endDate)
        endDate.setHours(23)
        endDate.setMinutes(59)
        endDate.setSeconds(59)
        parseFilter = { ...parseFilter, createdAt: { $gte: startDate, $lt: endDate } }
        delete parseFilter.startDate
        delete parseFilter.endDate
        filterQuery = { ...filterQuery, ...parseFilter };
    }

    if (orgId) {
        filterQuery = { ...filterQuery, invoiceGeneratedBy: mongoose.Types.ObjectId(orgId) };
    }

    let aggregateQuery = [
        {
            $match: filterQuery
        },
        {
            $lookup: {
                from: 'orgdetails',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createrObj'
            }
        },
        {
            $unwind: { path: '$createrObj', preserveNullAndEmptyArrays: true }
        },
        {
            $lookup: {
                from: 'orgdetails',
                localField: 'createdFor',
                foreignField: '_id',
                as: 'createdForObj'
            }
        },
        {
            $unwind: { path: '$createdForObj', preserveNullAndEmptyArrays: true }
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
    if (search && search != "") {
        var searchRegex = new RegExp(`.*${search}.*`, "i")
        searchQuery = {
          $or: [
            { createrObjName: { $regex: searchRegex } },
            { createdForObjName: { $regex: searchRegex } },
          ]
        }
    
        aggregateQuery.push({ $match: searchQuery });
        
      }
      
    let result = await Report.aggregate(aggregateQuery).sort({ _id: sort }).skip(skip).limit(limit)
    if (currencyId) {

        result = result.filter((item) => {
            if (item.currencyObj && (String(item.currencyObj._id) == String(currencyId))){
                return true;
            }
            else {
                return false;
            }
        })
        
    }
    let totalResults 
    if (orgId) {
        totalResults = await Report.countDocuments({...filterQuery, createdBy: mongoose.Types.ObjectId(orgId)});
    }else{
        totalResults = await Report.countDocuments(filterQuery);
    }
    const totalPages = Math.ceil(totalResults / limit);

    const filteredCount = result.length;
    return { results: result, totalResults, totalPages, page, limit, filteredCount };
}
module.exports = getReports;
