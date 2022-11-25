import { env } from "config/env/server";
import { providers, Wallet } from "ethers";
import { _TypedDataEncoder } from "ethers/lib/utils";

export const provider = new providers.JsonRpcProvider(env.RPC_URL);

export const relayerSigner = new Wallet(
  env.NETWORK_KEY === "polygon-mumbai"
    ? "0x8a08140e5dd7eb70af23b28f53fe24a133b708d18368361cd3d55ddfc7cc9ee7"
    : "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // test address for local (hardhat 0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  provider
);

export const DOMAIN_SELECTOR_HASH = _TypedDataEncoder.hashDomain({
  name: "Pocket",
  version: "0.0.1",
  chainId: env.CHAIN_ID,
  verifyingContract: env.TRUSTED_FORWARDER,
});

export const TYPE_HASH =
  "0x2510fc5e187085770200b027d9f2cc4b930768f3b2bd81daafb71ffeb53d21c4";
