const mongoose = require('mongoose');
const { GlobalConfig } = require('../../globalConfig/model.globalConfig');
const Report = require('../reporting.model');

const addReport = async (data) => {
    console.log("Creating organization data ::", data);
    // change amount here 
    const config = await GlobalConfig.findOne(); //.exec()
    data.amount=(data.amount)-((config.platformCommission)/100)*(data.amount)
    const report = await Report.create(data);

    return report;
};
module.exports = addReport;
