const OrgDetailsModel = require('../orgDetails.model');


const listOrganization = async () => {
  var filterQuery = { 
    active: true 
  };
  
  
 
  const listResult = await OrgDetailsModel.find(filterQuery, {name: 1, organizationId: 1, desc: 1,supportedCurrency:1, primaryCurrency: 1}).sort({ _id: -1 })
  return listResult
}

module.exports = {
    listOrganization
}