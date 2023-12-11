require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
// require('@openzeppelin/hardhat-upgrades');
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const maticvigilID = process.env.maticvigilID;

module.exports = {
    defaultNetwork: process.env.defaultNetwork,
    networks: {
        hardhat: {},
        maticMainNet: {
            url: "https://rpc-mainnet.maticvigil.com/v1/" + maticvigilID,
            accounts: [PRIVATE_KEY],
            gas: "auto",
            gasPrice: "auto",
        },
        maticTestNet: {
            url: "https://rpc-mumbai.maticvigil.com/v1/" + maticvigilID,
            accounts: [PRIVATE_KEY],
            gas: "auto",
            gasPrice: "auto",
        },
    },
    solidity: {
        version: "0.8.9",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
    mocha: {
        timeout: 20000,
    },
    etherscan: {
        apiKey: process.env.POLYGONSCAN_API_KEY,
    }
};
