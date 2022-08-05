import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';
import '@nomicfoundation/hardhat-network-helpers';
// import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
// import 'hardhat-gas-reporter';
// import "solidity-coverage";
import '@openzeppelin/hardhat-upgrades';
import * as constants from './utils/constants';

dotenv.config({
  path: '../../.env',
});

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.9',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },

  networks: {
    hardhat: {
      forking: {
        url: constants.CHOSEN_NETWORK.url,
      },
      chainId: constants.CHOSEN_NETWORK.chainId,
    },
    polygon: {
      url:
        'https://polygon-mainnet.g.alchemy.com/v2/' +
        process.env.NEXT_PUBLIC_KEY_ALCHEMY,
      chainId: 137,
    },
    mumbai: {
      url:
        'https://polygon-mumbai.g.alchemy.com/v2/' +
        process.env.NEXT_PUBLIC_KEY_ALCHEMY,
      chainId: 80001,
      gasPrice: 40000000000,
      gas: 3000000,
    },
  },

  // gasReporter: {
  //   enabled: true,
  //   // currency: 'USD',
  // },
  //   etherscan: {
  //     apiKey: process.env.ETHERSCAN_API_KEY,
  //   },
};

export default config;
