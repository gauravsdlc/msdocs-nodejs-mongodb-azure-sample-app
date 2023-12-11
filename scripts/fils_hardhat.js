const hre = require("hardhat");
const { ethers } = require("ethers");
const  axios  = require("axios");

const TOKEN_CONTRACT_ADDR = process.env.TOKEN_CONTRACT;
const TOKEN_CONTRACT_NAME = 'FILS'
const TOKEN_ABI = require('./token_contract_abi');

const PLATFORM_CONTRACT_ADDR = process.env.PLATFORM_CONTRACT;
const PLATFORM_CONTRACT_NAME = "FilsPlatform"
const PLATFORM_ABI = require('./platform_contract_abi');


const ADMIN_SECRET_KEY =  process.env.PRIVATE_KEY;
// const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL
const POLYGON_RPC_URL = "https://rpc-mumbai.maticvigil.com"

const Provider = new ethers.providers.JsonRpcProvider(POLYGON_RPC_URL);
const WALLET = new ethers.Wallet(ADMIN_SECRET_KEY, Provider);

const createOrganizationBlockchain = async({ organizationId, orgName, walletAddr }) => {
    // const Token = await ethers.getContractFactory(TOKEN_CONTRACT_NAME)
    // const tokenInstance = await Token.attach(TOKEN_CONTRACT_ADDR)

    // try {
    // const [deployer] = await hre.ethers.getSigners();
    // console.log("Deploying contracts with the account:", deployer.address);
    // const platform = await hre.ethers.getContractFactory(PLATFORM_CONTRACT_NAME);
    // const platformInstance = await platform.attach(PLATFORM_CONTRACT_ADDR);

    // const resp = await platformInstance.registerOrg(organizationId, orgName, walletAddr);
    // resp.wait()
    // console.log("resp",resp);
    // } catch (error) {
    //     console.log("createOrganization ::::::::>",error);
    // }
    let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    try {
        const { data } = await axios({
            method: 'get',
            url: "https://gasstation.polygon.technology/v2",
        })
        maxFeePerGas = ethers.utils.parseUnits(
            Math.ceil(data.fast.maxFee) + '',
            'gwei'
        )
        maxPriorityFeePerGas = ethers.utils.parseUnits(
            Math.ceil(data.fast.maxPriorityFee) + '',
            'gwei'
        )
    } catch {
        // ignore
    }
    try {

        const contract = new ethers.Contract(PLATFORM_CONTRACT_ADDR, PLATFORM_ABI, WALLET);
        const tx = await contract.registerOrg(organizationId, orgName, walletAddr,{
            maxFeePerGas,
            maxPriorityFeePerGas,
        });
        // console.log("TX createOrganization",tx);
        console.log("tx.hash ::",tx.hash);
    } catch (error) {
        console.log("createOrganization ::::::::>",error);
    }

}

const sendTokenToWalletAddr = async(walletAddr) => {
    console.log("+++++START+++++");
    let maxFeePerGas = ethers.BigNumber.from(20000000000) // fallback to 40 gwei
    let maxPriorityFeePerGas = ethers.BigNumber.from(20000000000) // fallback to 40 gwei
    try {
        const { data } = await axios({
            method: 'get',
            url: false
            ? 'https://gasstation-mainnet.matic.network/v2'
            : 'https://gasstation-mumbai.matic.today/v2',
        })
        maxFeePerGas = ethers.utils.parseUnits(
            Math.ceil(data.fast.maxFee) + '',
            'gwei'
        )
        maxPriorityFeePerGas = ethers.utils.parseUnits(
            Math.ceil(data.fast.maxPriorityFee) + '',
            'gwei'
        )
    } catch {
        // ignore
    }
    try {
        const amountIn = ethers.utils.parseUnits(tokens.toString(), 18)
        const contract = new ethers.Contract(TOKEN_CONTRACT_ADDR, TOKEN_ABI, WALLET);
        const tx = await contract.transfer( walletAddr,amountIn,{
            maxFeePerGas,
            maxPriorityFeePerGas,
        });
        // console.log("TX sendTokenToWalletAddr",tx);
        console.log("tx.hash ::",tx.hash);
    } catch (error) {
        console.log("sendTokenToWalletAddr ::::::::>",error);
    }
 }
const getTokenBalance = async(walletAddr) => {

    try {
        const contract = new ethers.Contract(TOKEN_CONTRACT_ADDR, TOKEN_ABI, Provider);
        const tokens = await contract.balanceOf(walletAddr);
        if(tokens){
               return ethers.utils.formatEther(tokens._hex)
            }
//             const provider = new ethers.providers.JsonRpcProvider(POLYGON_RPC_URL);
//   const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDR, TOKEN_ABI, provider);
//   const balance = await tokenContract.balanceOf(walletAddr);
//   return Number(ethers.utils.formatEther(balance).toString());
    } catch (error) {
        console.log("sendTokenToWalletAddr ::::::::>",error);
    }
 }
module.exports = {
    createOrganizationBlockchain,
    sendTokenToWalletAddr,
    getTokenBalance
}
