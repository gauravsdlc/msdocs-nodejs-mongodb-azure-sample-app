const mongoose = require('mongoose');
const Currency = require('../currency/currency.model');
const UserModel = require('../../models/user.model');
const { addWebhook } = require('../webhooks/services/addWebhooks.service');
// const {GlobalConfig} = require('./model.globalConfig');
const Webhook = require('../webhooks/model');
const Points = require('../points/points.model');
const { roles } = require('../../config/roles');
const { User } = require('../../models');

const getOverviewData = async (orgId,organizationId) => {
        
    let totalIncomingAmount = 0;
    let totalOutgoingAmount = 0;
    
    const filterQuery = { orgId: mongoose.Types.ObjectId(orgId), active: true }
    
    // show last 7 days transactions
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const inComingFilterDateQuery = { transferTo:organizationId,active: true,createdAt: { $gte: oneWeekAgo },status:1}
    const outgoingFilterDateQuery = { organizationId:organizationId,active: true,createdAt: { $gte: oneWeekAgo },status:1}
    // show last 7 days transactions
  
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    // show last 30 days transactions outgoing   
    const outgoingPipeline = [
        {
          $match: {
            organizationId:organizationId,active: true,
            status:1,
            createdAt: {
              $gte: oneMonthAgo,
              $lte: currentDate,
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
              },
            },
            count: 1,
            _id: 0,
          },
        },
        {
          $sort: { date: 1 },
        },
    ];
    // show last 30 days transactions outgoing   

    // show last 30 days transactions incoming   
    const incomingPipeline = [
        {
          $match: {
            transferTo:organizationId,active: true,
            status:1,
            createdAt: {
              $gte: oneMonthAgo,
              $lte: currentDate,
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
              },
            },
            count: 1,
            _id: 0,
          },
        },
        {
          $sort: { date: 1 },
        },
    ];
    // show last 30 days transactions incoming   
    
    // show total outgoing tokens
    const filterOutgoingTokenQuery = { status:1,active: true, organizationId:organizationId }
    // show total outgoing tokens

    // show total incoming tokens
    const filterIncomingTokenQuery = { status:1,active: true, transferTo:organizationId }
    // show total incoming tokens    

    let incomingTokenCount = await Points.find(filterIncomingTokenQuery)
    let outgoingTokenCount = await Points.find(filterOutgoingTokenQuery)

    if (incomingTokenCount) {
        incomingTokenCount.forEach(element => {
        const total = element.conversionRate * element.amount;
        totalIncomingAmount += total;
        });
    }
    if (outgoingTokenCount) {
        outgoingTokenCount.forEach(element => {
        const total = element.conversionRate * element.amount;
        totalOutgoingAmount += total;
        });
    }
    
    let apiCount = await Points.aggregate([{ $match: filterQuery }, { $group: { _id: null, total: { $sum: "$tryCount" } } }])
    let failedApiHits = await Webhook.aggregate([{ $match: filterQuery }, { $group: { _id: null, total: { $sum: "$failCount" } } }])
    const totalWebHooks = await Webhook.countDocuments(filterQuery)
    apiCount = apiCount[0] && apiCount[0].total ? apiCount[0].total : 0
    failedApiHits = failedApiHits[0] && failedApiHits[0].total ? failedApiHits[0].total : 0

    let incomingTransactionCount = await Points.countDocuments(inComingFilterDateQuery)
    let outgoingTransactionCount = await Points.countDocuments(outgoingFilterDateQuery)
    let lastThirtyDaysOutgoingTransactions = await Points.aggregate(outgoingPipeline, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          return result;
        }
      });
    let lastThirtyDaysIncomingTransaction = await Points.aggregate(incomingPipeline, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          return result;
        }
      });
      

    return { failedApiHits, apiCount, totalWebHooks,incomingTransactionCount,outgoingTransactionCount,
        totalIncomingAmount,totalOutgoingAmount,lastThirtyDaysIncomingTransaction,lastThirtyDaysOutgoingTransactions };
}
module.exports = { getOverviewData };

