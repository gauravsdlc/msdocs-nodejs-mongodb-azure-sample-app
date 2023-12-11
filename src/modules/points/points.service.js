const mongoose = require('mongoose');
const Model = require('./points.model');


const getTotalPoints = async ({organizationId,incoming, startDate, endDate}) => {
  let filterQuery = { 
    "status" : Number(1), 
  }
  if(incoming){
    filterQuery = {...filterQuery, transferTo: String(organizationId)}
  }else{
    filterQuery = {...filterQuery, organizationId: String(organizationId)} 
  }
   
  if (startDate && endDate) {
      const _startDate = new Date(startDate)
      const _endDate = new Date(endDate)
      _endDate.setHours(23)
      _endDate.setMinutes(59)
      _endDate.setSeconds(59)
      filterQuery["createdAt"] = { $gte : new Date(_startDate.toISOString()), $lte : new Date(_endDate.toISOString()) } 
    }

  const result = await Model.find(filterQuery, {amount:1})
  console.log("getTotalPoints :: filterQuery ::", filterQuery);
  console.log("getTotalPoints :: Result :", result.length);
  
  return  result
};
const getAllPointsByQuery = async (organizationId , page, limit, startDate, endDate,status) => {
  console.log("from all points",organizationId , page, limit, startDate, endDate,status);
  const skip = (page - 1) * limit;
  let filterQuery = { active: true , organizationId};
  let parseFilter = { startDate, endDate }
  if(status){
   filterQuery = { ...filterQuery,status};
  }
  if (parseFilter.startDate && parseFilter.endDate) {
      const startDate = new Date(parseFilter.startDate)
      let endDate = new Date(parseFilter.endDate)
      endDate.setHours(23)
      endDate.setMinutes(59)
      endDate.setSeconds(59)
      parseFilter = { ...parseFilter, createdAt: { $gte: startDate, $lt: endDate } }
      delete parseFilter.startDate
      delete parseFilter.endDate
      filterQuery = { ...filterQuery, ...parseFilter };
  }
  const list = await Model.find(filterQuery).sort({ _id: -1 }).skip(skip).limit(limit);
  const totalResults = await Model.countDocuments(filterQuery);
  const totalPages = Math.ceil(totalResults / limit);
  console.log("result",list,organizationId);
  const filteredCount = list.length;
  return { results: list, totalResults, totalPages, page, limit, filteredCount }
};

const getAllPointsForInvoiceGeneration = async (organizationId , startDate, endDate) => {
  console.log("from all points",organizationId ,  startDate, endDate);
  let filterQuery = { active: true , organizationId, status: 1,invoiceGenerated:false};
  let parseFilter = { startDate, endDate }

  if (parseFilter.startDate && parseFilter.endDate) {
      const startDate = new Date(parseFilter.startDate)
      let endDate = new Date(parseFilter.endDate)
      endDate.setHours(23)
      endDate.setMinutes(59)
      endDate.setSeconds(59)
      parseFilter = { ...parseFilter, createdAt: { $gte: startDate, $lt: endDate } }
      delete parseFilter.startDate
      delete parseFilter.endDate
      filterQuery = { ...filterQuery, ...parseFilter };
  }
  const list = await Model.find(filterQuery).sort({ _id: -1 });

  return list
};

const addPoints = async ({
  refId,
  customerId,       
  amount,
  organizationId,
  transferTo,
  orgId,
  currencyId,
  toCurrencyId
}) => {

    const data = {
      refId,
      customerId,       
      amount,
      organizationId,
      transferTo,
      orgId,
      currencyId,
      toCurrencyId
    }

    try {


      const orgDetails = await OrgModel.findOne({organizationId: organizationId})
      const primaryCurrency = await CurrencyModel.findOne({_id: currencyId})
      const toCurrency = await CurrencyModel.findOne({_id: toCurrencyId})
      let config = await getGlobalConfig()
      
      console.log("config ------------------", config);

      data["amount"] = Number(data.amount)
      data["commissionType"] =  config.commissionType
      data["commission"] =  Number(config.platformCommission)

      const primaryCurrRate =  primaryCurrency.conversionRate 

      const totalFilsToken = data.amount  *  primaryCurrRate
      
      let afterCommissionDeduction
      if(config.commissionType = "percentage") {
        let commissionVal  = Number((Number(totalFilsToken) * (data.commission / 100)).toFixed(2))
        afterCommissionDeduction = totalFilsToken - commissionVal
      } else {
        afterCommissionDeduction = totalFilsToken - data.commission
      }

      const sentFilsToken = afterCommissionDeduction
      const toCurrencyRate = toCurrency.conversionRate 
      const currencyRate = primaryCurrency.conversionRate 
      
      data["toCurrencyRate"] = toCurrencyRate
      data["currencyRate"] = currencyRate
      data["sentFilsToken"] = sentFilsToken
      data["totalFilsToken"] = totalFilsToken

      console.log("-------------------------data----------------------", data);

      

      let balance = await getTokenBalance(orgDetails.wallet.address)

      console.log("------- Transfer Token -------");
      console.log(" balance :: ", balance);
      console.log(" sentFilsToken :: ", sentFilsToken);

      // /* Check receiver bank supports the selected currency */
      // if (!transferToOrg.supportedCurrency.includes(currencyId) || currencyId != transferToOrg.primaryCurrency) {
      //   return {
      //     error: `${transferToOrg?.name} does not supported to ${primaryCurrency.name} currency`
      //   }
      // }

      if(balance <= sentFilsToken) {
        return {
          error: "You don't have enough Fils tokens, or please verify your conversion rate"
        }
      }

      let matic = await getMaticBalance(orgDetails.wallet.address)

      if(matic < 1) {
        return {
          error: "You currently possess an insufficient amount of Matic in your account to cover the gas fees for this transaction."
        }
      }
      


    } catch (error) {
      console.error("error ------", error);
      return {
        error: `something went wrong: ${error.message}`
      }
    }


    let webhook = await WebhookModel.findOne({orgId: mongoose.Types.ObjectId(orgId), active: true})
    if(webhook){
      const apiResult = await Model.create(data);
      return {
        data: apiResult
      };
    } 

    return {
      error: "No active webhook found associated with your account, please add the webhook and try again"
    }
    
  };
  
const getAllPointsByQuery2 = async (filterQuery) => {
    let query = {
        ...filterQuery,
        active: true
    }
  const list = await Model.find(query);
  return list;
};

const checkUnsettledPoints = async () => {

  try {
    
    let pointList = await getAllPointsByQuery2({status: 0})
    console.log(pointList.length);
    if(pointList.length){

      for (let idx = 0; idx < pointList.length; idx++) {
        const point = pointList[idx];

        if(point.tryCount > 3) {
          await Model.findByIdAndUpdate(point._id, {$set: { status: 2}})
          continue
        } else {
          await Model.findByIdAndUpdate(point._id, {$set: { tryCount: (point.tryCount + 1) }})
        }

        let webhook = await WebhookModel.findOne({orgId: mongoose.Types.ObjectId(point.orgId), isActive: true})
        console.log("Found webhook :", webhook, point.organizationId, point.orgId);
        if(webhook && webhook.endpoint){
          try {
            const body = {
              organizationId: point.organizationId, 
              customerId: point.customerId, 
              referenceId: point.referenceId, 
              amount: point.amount,
              transferTo: point.transferTo,
            }
            
            const reqUrl = webhook.endpoint
            console.log("Webhook endpoint :", reqUrl);
            let res = await apiHelper.webhookAPI(reqUrl, {
              method: 'post',
              body: JSON.stringify(body),
              headers: {
                'Content-Type': 'application/json'
              }
            })
            
            if(res && res.success === true){
              console.error("webhook success ::", point.organizationId, reqUrl);

              try {

                let orgDetails = await OrgModel.findOne({organizationId: point.organizationId})

                /*  */
                const amountInUSD = Number(point.originalAmount)

                sendToken_transferToOrg({
                  point: point,
                  orgId: Number(point.transferTo),
                  custRef: point.customerId,
                  amountInUSD: Number(amountInUSD),
                  orgPK: orgDetails.wallet.privateKey,
                  fromOrgId: point.organizationId,
                  fromWalletAddress: orgDetails.wallet.address,
                  sentFilsToken: point.sentFilsToken,
                })

              } catch (error) {
                console.log(" error ::", error);
              }

              // await Model.findByIdAndUpdate(point._id, {$set: {status: 1}})
              // sendTokenToWalletAddr({walletAddr:'',tokens:})
              /* Updating success count */
              let count = webhook.successCount || 0
              count = count + 1
              await WebhookModel.findByIdAndUpdate(webhook._id, {$set: {successCount: Number(count)}})

              
            } else {
              console.error("webhook error ::", point.organizationId, reqUrl);
              let fCount = webhook.failCount || 0
              fCount= fCount + 1
              await WebhookModel.findByIdAndUpdate(webhook._id, {$set: {failCount: Number(fCount)}})
            }

            
          } catch (error) {
            console.error("webhook error ::", error.message);
            let fCount = webhook.failCount || 0
            fCount = fCount + 1
            await WebhookModel.findByIdAndUpdate(webhook._id, {$set: {failCount: fCount}})
          }
        }
      }
    }


  } catch (error) {
    console.error("Check Unsettled Points ::", error);
  }

  
}

  module.exports = {
    getAllPointsByQuery,
    getTotalPoints,
    getAllPointsForInvoiceGeneration,
    addPoints,
    getAllPointsByQuery2,
    checkUnsettledPoints
  }