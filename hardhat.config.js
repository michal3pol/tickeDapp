require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    goerli: {
      url: process.env.QUICKNODE_API_KEY_URL,
      accounts: [process.env.WALLET_PRIVATE_KEY],
    },
    matic: {
      url: process.env.ALCHEMY_MUMBAI_API_KEY,
      accounts: [process.env.WALLET_PRIVATE_KEY],
    },
    hardhat: {
      blockGasLimit: 10000000000,
    },
    localhost: {
      chainId: 31337,
    }
  },
  namedAccounts: {
    deployer: {
      default: 0, 
      1: 0, 
    },
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1
      }
    }
  },
  // settings: {
  //   optimizer: {
  //     enabled: true,
  //     runs: 1
  //   }
  // }
};
