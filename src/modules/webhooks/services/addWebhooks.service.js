const mongoose = require('mongoose');
const Model = require('../model');

const addWebhook = async (data) => {
    let orgId = data.orgId
    const updated = await Model.updateMany({orgId: mongoose.Types.ObjectId(orgId)}, {$set: {isActive: false}})
    const apiResult = await Model.create(data);
    return apiResult;
  };
  
const getWebhooksByOrgId = async (orgId) => {
  const list = await Model.find({
    orgId,
    active: true
  });
  return list;
};


const removeWebhookById = async (id , orgId) => {
  const apiResult = await Model.findOneAndUpdate({  active:true,_id:mongoose.Types.ObjectId(id) }, { active: false });
  return apiResult;
};

  module.exports = {
    addWebhook,
    getWebhooksByOrgId,
    removeWebhookById
  }