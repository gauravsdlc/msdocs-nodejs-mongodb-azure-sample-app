const {GlobalConfig} = require('../model.globalConfig')

const getGlobalConfig = async () => {
    const result = await GlobalConfig.findOne({});
    return result
};

module.exports = getGlobalConfig
