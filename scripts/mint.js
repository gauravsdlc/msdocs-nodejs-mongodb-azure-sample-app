const hre = require("hardhat");
module.exports = async function (data) {
    let { contractAddress, transferTo } = data;
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
    const StarCDDTContract = await hre.ethers.getContractFactory("StarCDDT");
    const StarCDDTDeployedContract = await StarCDDTContract.attach(contractAddress);
    let res = await StarCDDTDeployedContract.mint(transferTo);
    const receipt = await res.wait();
    const [transferEvent] = receipt.events;
    const { tokenId } = transferEvent.args;
    console.log("tokenId : ", tokenId)
    // console.log("res : ", res)
    return { res, tokenId: tokenId.toNumber() };
}