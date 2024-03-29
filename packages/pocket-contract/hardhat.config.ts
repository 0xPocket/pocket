import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';
import '@nomicfoundation/hardhat-network-helpers';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import '@openzeppelin/hardhat-upgrades';
import NETWORK_CONFIG from 'config/network';
import 'hardhat-deploy';

dotenv.config({
  path: '../../.env',
});

const config: HardhatUserConfig = {
  namedAccounts: {
    deployer: {
      default: 0,
    },
    parent1: 1,
    parent2: 2,
    parent3: 3,
    child1: 4,
    child2: 5,
    child3: 6,
    elonmusk: 10,
    damian: 13,
    xavier: 14,
    lola: 15,
    whale: {
      default: '0xe7804c37c13166fF0b37F5aE0BB07A3aEbb6e245',
      polygon: '0xe7804c37c13166fF0b37F5aE0BB07A3aEbb6e245',
      mumbai: '0xe41c53eb9fce0ac9d204d4f361e28a8f28559d54',
    },
  },
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
  verify: {
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY,
    },
  },
  networks: {
    hardhat: {
      mining: {
        auto: true,
        interval: 5000,
      },
      forking: {
        url: NETWORK_CONFIG['polygon-mainnet'].RPC_URL,
      },
      chainId: 137, // DO NOT TOUCH
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
