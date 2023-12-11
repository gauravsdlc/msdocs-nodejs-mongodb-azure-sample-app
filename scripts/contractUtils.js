const hre = require("hardhat");
function wait(milisec) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, milisec);
  });
}

async function checkBalance() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(
    "Deploying contracts with the account - check balance:",
    deployer.address
  );
  console.log("Account balance:", (await deployer.getBalance()).toString());
}

async function deployNFTContract(data) {
  let {
    contractName,
    tokenTracker,
    baseURL,
    maxSupply,
    royaltyFee,
    platformCommission,
    verify,
    owner,
  } = data;
  console.log("Compile Contract now... ");
  await hre.run("compile");
  console.log("Compile Contract Done ✓ ");
  console.log("Deploying Contract now");
  const UtilityArtNFT = await hre.ethers.getContractFactory("UtilityArtNFT");
  const UtilityArtNFTDeployedContract = await UtilityArtNFT.deploy(
    contractName,
    tokenTracker,
    baseURL,
    maxSupply,
    royaltyFee,
    platformCommission,
    owner
  );
  console.log("Deploying Contract done, waiting for confirmation...");
  await UtilityArtNFTDeployedContract.deployed();
  console.log("Contract Deployed ✓ ");
  console.log("Contract Address:", UtilityArtNFTDeployedContract.address);
  try {
    if (verify) {
      let contractPath = `contracts/UtilityArtNFT.sol:UtilityArtNFT`;
      console.log("waiting for 60 sec");
      await wait(40000);
      await hre.run("verify:verify", {
        address: UtilityArtNFTDeployedContract.address,
        contract: contractPath,
        constructorArguments: [
          contractName,
          tokenTracker,
          baseURL,
          maxSupply,
          royaltyFee,
          platformCommission,
          owner,
        ],
      });
    }
  } catch (error) {
    console.log("err while verify : ", error);
  }

  return UtilityArtNFTDeployedContract;
}

async function deployNFTContractFactory(data) {
  let { verify } = data;
  console.log("Compile Factory Contract now... ");
  await hre.run("compile");
  console.log("Compile Factory Contract Done ✓ ");
  console.log("Deploying Factory Contract now");
  const UtilityArtFactory = await hre.ethers.getContractFactory(
    "UtilityArtFactory"
  );
  const UtilityArtFactoryDeployedContract = await UtilityArtFactory.deploy();
  console.log("Deploying Factory Contract done, waiting for confirmation...");
  await UtilityArtFactoryDeployedContract.deployed();
  console.log("Factory Contract Deployed ✓ ");
  console.log(
    "Factory Contract Address:",
    UtilityArtFactoryDeployedContract.address
  );
  if (verify) {
    let contractPath = `contracts/UtilityArtFactory.sol:UtilityArtFactory`;
    console.log("waiting for 60 sec");
    await wait(40000);
    await hre.run("verify:verify", {
      address: UtilityArtFactoryDeployedContract.address,
      contract: contractPath,
      constructorArguments: [],
    });
  }
  return UtilityArtFactoryDeployedContract;
}

async function deployNFTContractMarketplace(data) {
  let { platformFee, feeRecipient, factoryAddr, verify } = data;
  console.log("Compile Marketplace Contract now... ");
  await hre.run("compile");
  console.log("Compile Marketplace Contract Done ✓ ");
  console.log("Deploying Marketplace Contract now");
  const UtilityArtMarketplace = await hre.ethers.getContractFactory(
    "UtilityArtMarketplace"
  );
  const UtilityArtMarketplaceDeployedContract =
    await UtilityArtMarketplace.deploy(platformFee, feeRecipient, factoryAddr);
  console.log(
    "Deploying Marketplace Contract done, waiting for confirmation..."
  );
  await UtilityArtMarketplaceDeployedContract.deployed();
  console.log("Marketplace Contract Deployed ✓ ");
  console.log(
    "Marketplace Contract Address:",
    UtilityArtMarketplaceDeployedContract.address
  );
  if (verify) {
    let contractPath = `contracts/UtilityArtMarketplace.sol:UtilityArtMarketplace`;
    console.log("waiting for 60 sec");
    await wait(40000);
    await hre.run("verify:verify", {
      address: UtilityArtMarketplaceDeployedContract.address,
      contract: contractPath,
      constructorArguments: [platformFee, feeRecipient, factoryAddr],
    });
  }
  return UtilityArtMarketplaceDeployedContract;
}

async function createCollection(data) {
  let {
    contractName,
    tokenTracker,
    baseURL,
    maxSupply,
    royaltyFee,
    platformCommission,
    factoryAddress,
    owner,
  } = data;
  const UtilityArtFactoryContract = await hre.ethers.getContractFactory(
    "UtilityArtFactory"
  );
  const UtilityArtFactoryDeployedContract =
    await UtilityArtFactoryContract.attach(factoryAddress);
  let res = await UtilityArtFactoryDeployedContract.createNFTCollection(
    contractName,
    tokenTracker,
    baseURL,
    maxSupply,
    royaltyFee,
    platformCommission,
    owner
  );
  const receipt = await res.wait();
  let events = receipt.events;
  let nftContractAddress;
  for (let i = 0; i < events.length; i++) {
    const aEvent = events[i];
    if (aEvent.event == "CreatedNFTCollection") {
      nftContractAddress = aEvent.args[1];
    }
  }

  console.log("NFT contract Address : ", nftContractAddress);

  return nftContractAddress;
}

async function mintNFT(data) {
  let { contractAddress, transferTo, qty } = data;
  console.log("NFT mint Started");
  const UtilityArtNFTContract = await hre.ethers.getContractFactory(
    "UtilityArtNFT"
  );
  const UtilityArtNFTDeployedContract = await UtilityArtNFTContract.attach(
    contractAddress
  );
  let res = await UtilityArtNFTDeployedContract.mint(transferTo, qty);
  const receipt = await res.wait();
  let events = receipt.events;
  let tokenIdArr = [];
  for (let i = 0; i < events.length; i++) {
    const aEvent = events[i];
    if (aEvent.event == "Transfer") {
      console.log("Args : ", aEvent.args.tokenId.toNumber());
      tokenIdArr.push(aEvent.args.tokenId.toNumber());
    }
  }
  console.log("NFT minted : ", tokenIdArr.join(", "));
  return tokenIdArr;
}

async function completeBid(data) {
  let { marketplaceContractAddress, nftContractAddress, tokenId } = data;
  console.log("Auction completeBid Started");
  const UtilityArtNFTContract = await hre.ethers.getContractFactory(
    "UtilityArtMarketplace"
  );
  const UtilityArtNFTDeployedContract = await UtilityArtNFTContract.attach(
    marketplaceContractAddress
  );
  let res = await UtilityArtNFTDeployedContract.completeBid(
    nftContractAddress,
    tokenId
  );
  const receipt = await res.wait();
  console.log("res ", res);
  console.log("receipt ", receipt);
  console.log("Auction completeBid Done");
  return receipt;
}

async function totalSupply(data={contractAddress:"0xa21cd30cf4030bdd44a350068504000581be8dec"}) {
  let { contractAddress } = data;
  const [deployer] = await hre.ethers.getSigners();
  console.log("View Total Supply:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  const FilsContract = await hre.ethers.getContractFactory(
    "FilsPlatform"
    );
  const FilsDeployedContract = await FilsContract.attach(
      contractAddress
      );
  // const res2=  await  hre.ethers.provider.getCode(contractAddress)
  // const res3=  await  hre.ethers.

  let res = await FilsDeployedContract.owner();
  console.log("contractAddress : ",res);
  // return res.toString();
}

module.exports = {
  deployNFTContract,
  deployNFTContractFactory,
  deployNFTContractMarketplace,
  mintNFT,
  createCollection,
  totalSupply,
  completeBid,
};
