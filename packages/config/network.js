// @ts-check

const chain = require("wagmi/chains");

/**
 * @type {{ [k in 'polygon-mainnet' | "polygon-mumbai" | "localhost"]: { ERC20_ADDRESS: string; CHAIN_ID: number; ALCHEMY_KEY: string; RPC_URL: string; NETWORK_KEY: 'polygon-mainnet' | "polygon-mumbai"; WAGMI_CHAIN: import('wagmi').Chain ; TRUSTED_FORWARDER: string; SIGNER_WALLET: string; } }}
 **/
const NETWORK_CONFIG = {
  "polygon-mainnet": {
    ERC20_ADDRESS: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    CHAIN_ID: 137,
    ALCHEMY_KEY: "3yzPlXcA41Y49wI2INbE3q8kLi19ME2U",
    RPC_URL:
      "https://polygon-mainnet.g.alchemy.com/v2/3yzPlXcA41Y49wI2INbE3q8kLi19ME2U",
    NETWORK_KEY: "polygon-mainnet",
    WAGMI_CHAIN: chain.polygon,
    TRUSTED_FORWARDER: "0xda78a11fd57af7be2edd804840ea7f4c2a38801d",
    SIGNER_WALLET: "0x71a50908e8fa0F0e724AAB050c742Af22Dd8E32b", // kms signer
  },
  "polygon-mumbai": {
    ERC20_ADDRESS: "0x82b427A0Fb3b864b205F705165bFA083D018800D", // PKT
    CHAIN_ID: 80001,
    ALCHEMY_KEY: "BabbJEHqMsfVRZT86Wd-S2hhlvteU79q",
    RPC_URL:
      "https://polygon-mumbai.g.alchemy.com/v2/BabbJEHqMsfVRZT86Wd-S2hhlvteU79q",
    NETWORK_KEY: "polygon-mumbai",
    WAGMI_CHAIN: chain.polygonMumbai,
    TRUSTED_FORWARDER: "0x4d4581c01A457925410cd3877d17b2fd4553b2C5",
    SIGNER_WALLET: "0x9297108ceeE8b631B3De85486DB4Dd5fEfE20647", // testnet signer
  },
  localhost: {
    ERC20_ADDRESS: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    CHAIN_ID: 137,
    ALCHEMY_KEY: "3yzPlXcA41Y49wI2INbE3q8kLi19ME2U",
    RPC_URL: "http://localhost:8545",
    NETWORK_KEY: "polygon-mainnet",
    WAGMI_CHAIN: chain.polygon,
    TRUSTED_FORWARDER: "0xda78a11fd57af7be2edd804840ea7f4c2a38801d",
    SIGNER_WALLET: "0x71a50908e8fa0F0e724AAB050c742Af22Dd8E32b",
  },
};

module.exports = NETWORK_CONFIG;
