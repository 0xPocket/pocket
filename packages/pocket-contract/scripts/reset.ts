import { ethers } from 'hardhat';
import { PocketFaucet__factory } from '../typechain-types';
import * as dotenv from 'dotenv';

dotenv.config({
  path: '../../.env',
});

async function main() {
  const [account] = await ethers.getSigners();
  const faucet = PocketFaucet__factory.connect(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
    account
  );
  await faucet.connect(account).resetAll();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
