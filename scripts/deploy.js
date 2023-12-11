const hre = require("hardhat");


function wait(milisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, milisec);
    })
}


module.exports = async function (data) {
    let { contractName, tokenTracker, baseURL, maxSupply } = data;
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    await hre.run("compile");

    const StarCDDT = await hre.ethers.getContractFactory("StarCDDT");
    const StarCDDTDeployedContract = await StarCDDT.deploy(contractName, tokenTracker, baseURL, maxSupply);
    await StarCDDTDeployedContract.deployed();
    console.log("Token address:", StarCDDTDeployedContract.address);
    let contractPath = `contracts/StarCDDT.sol:StarCDDT`

    // console.log("waiting for 60 sec")
    // await wait(60000);

    // await hre.run('verify:verify', {
    //     address: StarCDDTDeployedContract.address, contract: contractPath, constructorArguments: [
    //         contractName, tokenTracker, baseURL, maxSupply
    //     ]
    // })

    return StarCDDTDeployedContract;
}