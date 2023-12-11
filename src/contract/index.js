// const hre = require("hardhat");
const { ethers } = require('ethers');
const axios = require('axios');
const Model = require('../modules/points/points.model')

const TOKEN_CONTRACT_ADDR = process.env.TOKEN_CONTRACT;
const TOKEN_CONTRACT_NAME = 'FILS';
const TOKEN_ABI = require('./token_contract_abi');

const PLATFORM_CONTRACT_ADDR = process.env.PLATFORM_CONTRACT;
const PLATFORM_ABI = require('./platform_contract_abi');

const ADMIN_SECRET_KEY = process.env.PRIVATE_KEY;
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL;

const getDefaultProvider = async () => {
  return new ethers.providers.JsonRpcProvider(POLYGON_RPC_URL);
}
const getAdminWallet = () => {
    const provider = new ethers.providers.JsonRpcProvider(POLYGON_RPC_URL);
    return new ethers.Wallet(ADMIN_SECRET_KEY, provider); 
}
async function getCurrentUSDRate() {
  const provider = new ethers.providers.JsonRpcProvider(POLYGON_RPC_URL);
  const pbContract = new ethers.Contract(PLATFORM_CONTRACT_ADDR, PLATFORM_ABI, provider);
  const rate = await pbContract?.usdRate();
  return Number(ethers.utils.formatEther(rate).toString());
}
async function updateRate(rate) {
  rate = Number(ethers.utils.parseUnits(rate.toString(), 'ether'));
  const ORG_WALLET = getAdminWallet()
  const pbContract = new ethers.Contract(PLATFORM_CONTRACT_ADDR, PLATFORM_ABI, ORG_WALLET);
  const tx = await pbContract?.setRate(rate.toString());
  return tx;
}

/* API DOC */
const sendTokenFromOrganizationToWallet = async ({ walletAddr, tokens, orgPK }) => {
const Provider1 = new ethers.providers.JsonRpcProvider(POLYGON_RPC_URL);

const ORG_WALLET = new ethers.Wallet(orgPK, Provider1);
let maxFeePerGas = ethers.BigNumber.from(20000000000); // fallback to 40 gwei
let maxPriorityFeePerGas = ethers.BigNumber.from(20000000000); // fallback to 40 gwei
try {
  const { data } = await axios({
    method: 'get',
    url: false ? 'https://gasstation-mainnet.matic.network/v2' : 'https://gasstation-mumbai.matic.today/v2',
  });
  maxFeePerGas = ethers.utils.parseUnits(Math.ceil(data.fast.maxFee) + '', 'gwei');
  maxPriorityFeePerGas = ethers.utils.parseUnits(Math.ceil(data.fast.maxPriorityFee) + '', 'gwei');
} catch {
  // ignore
}
try {
  const contract = new ethers.Contract(TOKEN_CONTRACT_ADDR, TOKEN_ABI, ORG_WALLET);
  const amountIn = ethers.utils.parseUnits(tokens.toString(), 18);
  const pba = await contract?.approve(TOKEN_CONTRACT_ADDR, ethers.utils.parseUnits(amountIn.toString(), 18));
  await pba.wait();
  const tx = await contract.transfer(walletAddr, amountIn, {
    maxFeePerGas,
    maxPriorityFeePerGas,
  });
  // console.log("TX sendTokenToWalletAddr",tx);
  console.log('tx.hash ::', tx.hash);
} catch (error) {
  console.log('sendTokenToWalletAddr ::::::::>', error);
}
};

const sendToken_transferToOrg = async ({ 
point,
orgId,
custRef,
sentFilsToken,
orgPK,
fromOrgId,
fromWalletAddress 
}) => {



const Provider1 = new ethers.providers.JsonRpcProvider(POLYGON_RPC_URL);
console.table({ orgId, custRef, sentFilsToken, orgPK });

const ORG_WALLET = new ethers.Wallet(orgPK, Provider1);
let maxFeePerGas = ethers.BigNumber.from(20000000000); // fallback to 40 gwei
let maxPriorityFeePerGas = ethers.BigNumber.from(20000000000); // fallback to 40 gwei
try {
  const { data } = await axios({
    method: 'get',
    url: 'https://gasstation.polygon.technology/v2',
  });
  maxFeePerGas = ethers.utils.parseUnits(Math.ceil(data.fast.maxFee) + '', 'gwei');
  maxPriorityFeePerGas = ethers.utils.parseUnits(Math.ceil(data.fast.maxPriorityFee) + '', 'gwei');
} catch {
  // ignore
}
try {
  const contract = new ethers.Contract(TOKEN_CONTRACT_ADDR, TOKEN_ABI, ORG_WALLET);
  const pbcontract = new ethers.Contract(PLATFORM_CONTRACT_ADDR, PLATFORM_ABI, ORG_WALLET);
  const amountIn = ethers.utils.parseUnits(sentFilsToken.toString(), 18);
  const pba = await contract?.approve(PLATFORM_CONTRACT_ADDR, ethers.utils.parseUnits(amountIn.toString(), 18));
  await pba.wait();
  console.log('-------------STEP 1', maxFeePerGas, maxPriorityFeePerGas);
  console.log("transferToOrg initiating", orgId, custRef, sentFilsToken, amountIn);
  const tx = await pbcontract.transferToOrg(Number(orgId), custRef, amountIn, {
    maxFeePerGas,
    maxPriorityFeePerGas,
  });
  console.log("Blockchain Response :: TX sendTokenToWalletAddr", tx);

  /* Adding entry in database */
  try {
    
    await Model.findByIdAndUpdate(point._id, {$set: {
      txHash: tx.hash,
      status: 1
    }})

  } catch (error) {
    console.error("Error Update point after ::", error);
  }
} catch (error) {
  console.log('Blockchain Send Token To Wallet Addr ::::::::>', error);

  await Model.findByIdAndUpdate(point._id, {$set: {
    status: 2
  }})
}
};

async function getTokenBalance(walletAddress) {
const provider = new ethers.providers.JsonRpcProvider(POLYGON_RPC_URL);
const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDR, TOKEN_ABI, provider);
const balance = await tokenContract.balanceOf(walletAddress);
return Number(ethers.utils.formatEther(balance).toString());
}

async function updateRate(rate) {
rate = Number(ethers.utils.parseUnits(rate, 'ether'));
const ORG_WALLET = getAdminWallet()
const pbContract = new ethers.Contract(PLATFORM_CONTRACT_ADDR, PLATFORM_ABI, ORG_WALLET);
const tx = await pbContract.setRate(rate);
return tx;
}

const getMaticBalance = async (walletAddress) => {
const provider = new ethers.providers.JsonRpcProvider(POLYGON_RPC_URL); // Replace with the Matic network RPC endpoint
const balance = await provider.getBalance(walletAddress);
return Number(ethers.utils.formatEther(balance).toString());
};

module.exports = {
  sendTokenFromOrganizationToWallet,
  sendToken_transferToOrg,
  getMaticBalance,
  getTokenBalance,
  updateRate,
  getCurrentUSDRate
};
