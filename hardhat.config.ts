import * as dotenv from 'dotenv';

import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
// import "hardhat-gas-reporter";
// import "solidity-coverage";
import '@openzeppelin/hardhat-upgrades';

dotenv.config();

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
        url:
          'https://polygon-mainnet.g.alchemy.com/v2/' +
          process.env.KEY_ALCHEMY_POLYGON,
      },
      chainId: 137,
    },
    local: {
      url: 'http://127.0.0.1:8545',
      accounts:
        process.env.PRIVATE_KEY_HH !== undefined
          ? [process.env.PRIVATE_KEY_HH]
          : [],
      chainId: 137,
    },
    polygon: {
      url:
        'https://polygon-mainnet.g.alchemy.com/v2/' +
        process.env.KEY_ALCHEMY_POLYGON,
      accounts:
        process.env.PRIVATE_KEY_POLYGON !== undefined
          ? [process.env.PRIVATE_KEY_POLYGON]
          : [],
      chainId: 137,
    },
  },
  //   gasReporter: {
  //     enabled: process.env.REPORT_GAS !== undefined,
  //     currency: "USD",
  //   },
  //   etherscan: {
  //     apiKey: process.env.ETHERSCAN_API_KEY,
  //   },
};

export default config;
