const mongoose = require('mongoose');
const Report = require('../reporting.model');

const deleteReportById = async (id, orgId) => {
    var filterQuery = { active: true, _id: mongoose.Types.ObjectId(id), };
    if (orgId) {
        filterQuery = { ...filterQuery, createdBy: mongoose.Types.ObjectId(orgId) };
    }
    const fetchResult = await Report.findOneAndUpdate(filterQuery, { active: false });
    return fetchResult;
}
module.exports = deleteReportById;