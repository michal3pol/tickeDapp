import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import { default as dotenv } from 'dotenv';
import 'solidity-docgen';

dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1,
      },
    },
  },
  networks: {
    // goerli: {
    //   url: process.env['QUICKNODE_API_KEY_URL'],
    //   accounts: [process.env['WALLET_PRIVATE_KEY']!],
    // },
    // matic: {
    //   url: process.env['ALCHEMY_MUMBAI_API_KEY'],
    //   accounts: [process.env['WALLET_PRIVATE_KEY']!],
    // },
    sepolia: {
      url: process.env['SEPOLIA_API_KEY_URL'],
      accounts: [process.env['WALLET_PRIVATE_KEY']!],
    },
    hardhat: {
      blockGasLimit: 10000000000,
    },
    localhost: {
      chainId: 31337,
    },
  },
  docgen: { 
    outputDir: "./documentation-solidity"
  } // if necessary to customize config
};

export default config;
