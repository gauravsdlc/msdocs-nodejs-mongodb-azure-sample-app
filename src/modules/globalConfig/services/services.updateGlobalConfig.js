const mongoose = require('mongoose');
const {GlobalConfig} = require('../model.globalConfig');

const updateGlobalConfig = async (_id, reqBody) =>{

    const updateCoinPriceSearchQuery = { active: true, _id: mongoose.Types.ObjectId(_id) };
    const updateCoinPriceResult = await GlobalConfig.findByIdAndUpdate(updateCoinPriceSearchQuery, reqBody, { new: true });
    return updateCoinPriceResult;
}
module.exports = updateGlobalConfig;