import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';
import '@nomicfoundation/hardhat-network-helpers';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import '@openzeppelin/hardhat-upgrades';
import NETWORK_CONFIG from 'config/network';
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
      forking: {
        url: NETWORK_CONFIG['polygon-mainnet'].RPC_URL,
      },
      chainId: NETWORK_CONFIG.localhost.CHAIN_ID,
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
    },
  },
};

export default config;
