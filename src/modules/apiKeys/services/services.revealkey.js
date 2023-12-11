const  Mongoose  = require('mongoose');
const { APIKey } = require('../../../models');


const revealkey = async (orgId,apiId) => {
    const apiResult = await APIKey.find({orgId,_id:apiId,active:true});
    return apiResult;
};

module.exports =  revealkey