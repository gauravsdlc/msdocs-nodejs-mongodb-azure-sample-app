const mongoose = require('mongoose');
const Points = require('../../points/points.model');
/**
 * Create a Currency
 * @param {Object} orgId
 * @returns {Promise<currency>}
 */
const getTransaction = async (orgId, page, limit,) => {

  const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const skip = (start - 1) * length;
    var filterQuery = { active: true, orgId: mongoose.Types.ObjectId(orgId) };
    let sortQuery = { _id: -1 };

    let aggregateQuery = [
        {
            $match: filterQuery
        },

        {
            $lookup: {
                from: 'orgdetails',
                localField: 'organizationId',
                foreignField: 'organizationId',
                as: 'organization',
                pipeline: [
                    {
                        $project: {
                            "name": 1,
                            "conversionRate": 1,
                            "primaryCurrency":1
                        }
                    }
                ],

            }
        },
        {
            $lookup: {
                from: 'orgdetails',
                localField: 'transferTo',
                foreignField: 'organizationId',
                as: 'transfer',
                pipeline: [
                    {
                        $project: {
                            "name": 1,
                            "conversionRate": 1,
                            "primaryCurrency":1
                        }
                    }
                ],

            }
        },

        {
            $unwind: { path: '$organization', preserveNullAndEmptyArrays: true },
        },
        {
            $unwind: { path: '$transfer', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
              from: 'currencies',
              localField: 'organization.primaryCurrency',
              foreignField: '_id',
              as: 'sendCurrency',
              pipeline: [
                {
                    $project: {
                       "conversionRate":1,
                       "prefix":1
                    }
                }
            ],
          }
      },
      {
          $lookup: {
              from: 'currencies',
              localField: 'transfer.primaryCurrency',
              foreignField: '_id',
              as: 'receiverCurrency',
              pipeline: [
                {
                    $project: {
                       "conversionRate":1,
                       "prefix":1
                    }
                }
            ],
          }
      },

      {
        $unwind: { path: '$sendCurrency', preserveNullAndEmptyArrays: true },
    },
    {
        $unwind: { path: '$receiverCurrency', preserveNullAndEmptyArrays: true }
    },
    ]

    const Transaction = await Points.aggregate(aggregateQuery)
    .sort(sortQuery)
    .skip(skip)
    .limit(length)

    const totalResults = await Points.countDocuments(filterQuery)
    const totalPages = Math.ceil(totalResults / length);

    return {
      data:Transaction,
      totalResults,
      totalPages,
      page: start,
      limit: length,
      status: true,
      code: 200,
    };
}

module.exports = getTransaction
