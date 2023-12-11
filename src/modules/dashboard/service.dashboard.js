const mongoose = require('mongoose');
const Currency = require('../currency/currency.model');
const UserModel = require('../../models/user.model');
const TransactionModel = require('../points/points.model');
const OrgDetails = require('../orgDetails/orgDetails.model');
const { getTokenBalance } = require('../../../scripts/fils_hardhat');


const getDashboardData = async () => {

    const adminWalletAddress = process.env.ADMIN_WALLET

    const query = { active: true }
    const orgCount = { role: {$in:['org','orgAdmin']}, active: true }
    let currentDateCommissionCount = 0;
    let oneWeekAgoCommissionCount = 0;
    let thirtyDaysAgoCommissionCount = 0;
    let walletBalances = []; // Store wallet balances and organization names here
    

    // show last 24 Hrs transactions
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    const transactionFilterQuery = { active: true,createdAt: { $gte: twentyFourHoursAgo },status:1}
    // show last 24 Hrs transactions

    // show current date transaction && Total Commission
    const currentDate = new Date();
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);
    const currentDateTransactionFilterQuery = { active: true, createdAt: { $gte: startOfDay, $lte: endOfDay }, status:1}
    // show current date transaction && Total Commission

     // show last 7 days total Commission
     const oneWeekAgo = new Date();
     oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
     const oneWeekAgoTransactionFilterQuery = { active: true,createdAt: { $gte: oneWeekAgo },status:1}
     // show last 7 days total Commission
   
     // show last 30 days total Commission
     const thirtyDaysAgo = new Date();
     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
     const thirtyDaysAgoTransactionFilterQuery = { status:1, active: true,createdAt: { $gte: thirtyDaysAgo } }
     // show last 30 days total Commission


    const result = await Currency.countDocuments(query)
    const result2 = await UserModel.countDocuments(orgCount)
    const allTransactionsLastTwentyFourHoursAgo = await TransactionModel.countDocuments(transactionFilterQuery)
    const currentDateTransaction = await TransactionModel.countDocuments(currentDateTransactionFilterQuery)
    const totalCommissionEarnedCurrentDate = await TransactionModel.find(currentDateTransactionFilterQuery)
    const totalCommissionEarnedOneWeekAgo = await TransactionModel.find(oneWeekAgoTransactionFilterQuery)
    const totalCommissionEarnedThirtyDaysAgo = await TransactionModel.find(thirtyDaysAgoTransactionFilterQuery)
    const adminWalletBalance = await getTokenBalance(adminWalletAddress);


    if (totalCommissionEarnedCurrentDate) {
        totalCommissionEarnedCurrentDate.forEach(element => {
            currentDateCommissionCount += element.commission
        });
    }
    if (totalCommissionEarnedOneWeekAgo) {
        totalCommissionEarnedOneWeekAgo.forEach(element => {
            oneWeekAgoCommissionCount += element.commission
        });
    }
    if (totalCommissionEarnedThirtyDaysAgo) {
        totalCommissionEarnedThirtyDaysAgo.forEach(element => {
            thirtyDaysAgoCommissionCount += element.commission
        });
    }

     let walletBalanceData = await  OrgDetails.find({active: true}).limit(5);
     if (walletBalanceData) {
        const walletBalancePromises = walletBalanceData.map(async (element) => {
            let walletBalance = await getTokenBalance(element?.wallet?.address);
            walletBalances.push({ organizationName: element.name, balance: walletBalance });
        });

        await Promise.all(walletBalancePromises);
        walletBalances.sort((a, b) => a.balance - b.balance);
    }
    
    const data = {
        currencyCount: result, orgCount: result2 , twentyFourHoursAgoTransactionsCount : allTransactionsLastTwentyFourHoursAgo,
        currentDateTransaction:currentDateTransaction,totalCommissionEarnedCurrentDate:currentDateCommissionCount,
        oneWeekAgoCommissionCount:oneWeekAgoCommissionCount,thirtyDaysAgoCommissionCount:thirtyDaysAgoCommissionCount,
        adminWalletBalance:adminWalletBalance, walletBalances: walletBalances
    }
    return data;
}
module.exports = { getDashboardData };

