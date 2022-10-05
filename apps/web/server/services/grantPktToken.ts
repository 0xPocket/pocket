import { env } from 'config/env/server';
import { providers, Wallet } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { ERC20__factory } from 'pocket-contract/typechain-types';

const provider = new providers.JsonRpcProvider(env.RPC_URL);
const wallet = new Wallet(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', // test address for local
  provider,
);

export async function grantPktToken(to: string) {
  const contract = ERC20__factory.connect(env.ERC20_ADDRESS, wallet);
  return contract.transfer(to, parseUnits('100', 18));
}
