const mongoose = require('mongoose');
const Report = require('../reporting.model');

const getSpecificReports = async (page=1, limit=10, startDate, endDate, currencyId , search ,sort =-1, organizationId,status=0) => {
    const skip = (page - 1) * limit;
    var filterQuery = { active: true , status:status};
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

    if (organizationId) {
        filterQuery = { ...filterQuery, createdBy: (organizationId) };
    }
    if (currencyId) {
        filterQuery={...filterQuery,currency:mongoose.Types.ObjectId(currencyId)}
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
    
    let totalResults 
    if (searchQuery) {
        totalResults = await Report.countDocuments({...filterQuery,...searchQuery});
    }else{
        totalResults = await Report.countDocuments(filterQuery);
    }
    // const totalResults = await Report.countDocuments({ active: true });
    const totalPages = Math.ceil(totalResults / limit);

    const filteredCount = result.length;
    return { results: result, totalResults, totalPages, page, limit, filteredCount };}

module.exports = getSpecificReports;
