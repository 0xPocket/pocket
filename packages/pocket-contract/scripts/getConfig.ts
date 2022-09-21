import { ethers } from 'hardhat';
import { PocketFaucet__factory } from '../typechain-types';
import * as dotenv from 'dotenv';
import * as constants from '../utils/constants';

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

  const config = await faucet.childToConfig(constants.DAMIAN_MUSK.address);
  const claimable = await faucet.computeClaimable(
    constants.DAMIAN_MUSK.address
  );
  console.log(
    'DAMIAN',
    config.lastClaim,
    claimable.toString(),
    config.periodicity
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
