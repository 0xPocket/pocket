import { env } from "config/env/server";
import { parseUnits } from "ethers/lib/utils";
import { ERC20__factory } from "pocket-contract/typechain-types";
import { relayerSigner } from "./ethereum";

export async function grantPktToken(to: string) {
  const contract = ERC20__factory.connect(env.ERC20_ADDRESS, relayerSigner);
  return contract.transfer(to, parseUnits("100", await contract.decimals()));
}
