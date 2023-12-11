const mongoose = require('mongoose');
const Points = require('../../points/points.model');
/**
 * Create a Points
 * @param {Object} PointsData
 * @returns {Promise<Points>}
 */
const getSingleTransaction = async (id) => {

    var filterQuery = { active: true, _id: mongoose.Types.ObjectId(id) };
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

    const response = await Points.aggregate(aggregateQuery);
    return response[0];
};

module.exports = getSingleTransaction
