const mongoose = require('mongoose');
const Report = require('../reporting.model');
const PointsModal = require('../../points/points.model')

const getReportById = async (id, orgId) => {
    var filterQuery = { active: true, _id: mongoose.Types.ObjectId(id), };
    if (orgId) {
        filterQuery = { ...filterQuery, createdBy: mongoose.Types.ObjectId(orgId) };
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
                as: 'createrObj',
                pipeline: [
                    {
                        $project: {
                            "name": 1,
                            "organizationId":1
                        }
                    }
                ],
            }
        },

        {
            $lookup: {
                from: 'orgdetails',
                localField: 'invoiceGeneratedFor',
                foreignField: '_id',
                as: 'createdForObj',
                pipeline: [
                    {
                        $project: {
                            "name": 1,
                            "organizationId":1
                        }
                    }
                ],
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
    const fetchResult = await Report.aggregate(aggregateQuery);
  
    const pointsArr = fetchResult[0].pointsArray.map(obj => mongoose.Types.ObjectId(obj._id))
    const points = await PointsModal.find({_id: {$in: pointsArr}},{ customerId: 1, refId: 1, amount: 1, createdAt: 1 })
    fetchResult[0].transactions = points

    return fetchResult;
}
module.exports = getReportById;
