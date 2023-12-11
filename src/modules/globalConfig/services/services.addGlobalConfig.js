const mongoose = require('mongoose');
const {GlobalConfig} = require('../model.globalConfig');

const addGlobalConfig = async (globalConfigData) =>{
    console.log("globalConfigData :==",globalConfigData);
    const addResult = await GlobalConfig.create(globalConfigData);
    return addResult;
}
module.exports = {addGlobalConfig};
