const mongoose = require('mongoose');
const UserModel = require('../../../models/user.model');
const { superAdminRole } = require('../../../config/roles');
const getSuperAdminDetails = async () => {
   
    let aggregateQuery = [
        {
            $match: {role: superAdminRole, active: true}
        },
        {
            $lookup: {
                from: 'orgdetails',
                localField: 'orgId',
                foreignField: '_id',
                as: 'orgdetails'
            }
        },
        {
            $unwind: { path: '$orgdetails', preserveNullAndEmptyArrays: true }
        },
        {
            $project: {
                "profileUrl" : 1,
                "name" : 1,
                "email" : 1,
                "seqId" : 1,
                "organizationId" : 1,
                "orgId" : 1,
                "orgdetails": 1,
            }
        }
    ]
    const admin = await UserModel.aggregate(aggregateQuery);
    return admin[0];
}
module.exports = getSuperAdminDetails;


