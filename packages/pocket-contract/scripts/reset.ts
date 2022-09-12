import { ethers } from 'hardhat';
import { PocketFaucet__factory } from '../typechain-types';
import * as dotenv from 'dotenv';
import { env } from 'config/env/server';

dotenv.config({
  path: '../../.env',
});

async function main() {
  const [account] = await ethers.getSigners();
  const faucet = PocketFaucet__factory.connect(
    env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    account
  );
  const tx = await faucet.connect(account).resetAll();
  console.log('reset initiated, waiting for transaction to complete ...');
  await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
