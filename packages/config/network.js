// @ts-check

const { Network } = require("alchemy-sdk");
const chain = require("wagmi/chains");

/**
 * @type {{ [k in 'polygon-mainnet' | "polygon-mumbai" | "eth-rinkeby" | "localhost"]: { ERC20_ADDRESS: string; CHAIN_ID: number; ALCHEMY_KEY: string; RPC_URL: string; NETWORK_KEY: Network; WAGMI_CHAIN: import('wagmi').Chain } }}
 **/
const NETWORK_CONFIG = {
  "polygon-mainnet": {
    ERC20_ADDRESS: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    CHAIN_ID: 137,
    ALCHEMY_KEY: "3yzPlXcA41Y49wI2INbE3q8kLi19ME2U",
    RPC_URL:
      "https://polygon-mainnet.g.alchemy.com/v2/3yzPlXcA41Y49wI2INbE3q8kLi19ME2U",
    NETWORK_KEY: Network.MATIC_MAINNET,
    WAGMI_CHAIN: chain.polygon,
  },
  "polygon-mumbai": {
    ERC20_ADDRESS: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
    CHAIN_ID: 80001,
    ALCHEMY_KEY: "BabbJEHqMsfVRZT86Wd-S2hhlvteU79q",
    RPC_URL:
      "https://polygon-mumbai.g.alchemy.com/v2/BabbJEHqMsfVRZT86Wd-S2hhlvteU79q",
    NETWORK_KEY: Network.MATIC_MUMBAI,
    WAGMI_CHAIN: chain.polygonMumbai,
  },
  "eth-rinkeby": {
    ERC20_ADDRESS: "0x47da6c0b7f3fada850898d1e61ae546fc7b603f9",
    CHAIN_ID: 4,
    ALCHEMY_KEY: "ed3T1Tgpsza8IFDmTW4n4vMJFHwPzOCu",
    RPC_URL:
      "https://eth-rinkeby.alchemyapi.io/v2/ed3T1Tgpsza8IFDmTW4n4vMJFHwPzOCu",
    NETWORK_KEY: Network.ETH_RINKEBY,
    WAGMI_CHAIN: chain.rinkeby,
  },
  localhost: {
    ERC20_ADDRESS: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    CHAIN_ID: 137,
    ALCHEMY_KEY: "3yzPlXcA41Y49wI2INbE3q8kLi19ME2U",
    RPC_URL: "http://localhost:8545",
    NETWORK_KEY: Network.MATIC_MAINNET,
    WAGMI_CHAIN: chain.polygon,
  },
};

module.exports = NETWORK_CONFIG;
