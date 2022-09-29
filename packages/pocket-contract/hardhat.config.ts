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
    whale: {
      default: '0xf977814e90da44bfa03b6295a0616a897441acec',
      polygon: '0xf977814e90da44bfa03b6295a0616a897441acec',
      mumbai: '0xe41c53eb9fce0ac9d204d4f361e28a8f28559d54',
    },
    elonmusk: 10,
    damian: 13,
    xavier: 14,
    lola: 15,
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
