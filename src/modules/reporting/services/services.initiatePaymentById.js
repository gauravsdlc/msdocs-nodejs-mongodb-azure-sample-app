const mongoose = require('mongoose');
const Report = require('../reporting.model');
const initiatePaymentById = async (id) => {
   
    const filterQuery = { active: true, _id: mongoose.Types.ObjectId(id)};
    const fetchResult = await Report.findOneAndUpdate(filterQuery, {isInitiated:true});
    return fetchResult;
}
module.exports = initiatePaymentById;