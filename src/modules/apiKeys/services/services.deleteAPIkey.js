const { APIKey } = require('../../../models');


const deleteAPIkey = async (orgId, apiId) => {
  const apiResult = await APIKey.findOneAndUpdate({ orgId, _id: apiId, active: true }, { active: false });
  return apiResult;
};

module.exports = deleteAPIkey
