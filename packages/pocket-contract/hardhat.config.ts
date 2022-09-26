import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';
import '@nomicfoundation/hardhat-network-helpers';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import '@openzeppelin/hardhat-upgrades';
import NETWORK_CONFIG from 'config/network';
// import 'solidity-coverage';
// import TEST from 'config/env/client';

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
      // mining: {
      // auto: false,
      // interval: 100,
      // },
      forking: {
        url: NETWORK_CONFIG['polygon-mainnet'].RPC_URL,
      },
      chainId: 1337, // DO NOT TOUCH
    },
    polygon: {
      url: NETWORK_CONFIG['polygon-mainnet'].RPC_URL,
      chainId: NETWORK_CONFIG['polygon-mainnet'].CHAIN_ID,
    },
    mumbai: {
      url: NETWORK_CONFIG['polygon-mumbai'].RPC_URL,
      chainId: NETWORK_CONFIG['polygon-mumbai'].CHAIN_ID,
      gasPrice: 40000000000,
      gas: 3000000,
      accounts: [
        '0x8a08140e5dd7eb70af23b28f53fe24a133b708d18368361cd3d55ddfc7cc9ee7',
      ],
    },
  },
};

export default config;
