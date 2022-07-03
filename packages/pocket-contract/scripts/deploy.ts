import { ethers, network, upgrades } from 'hardhat';
import * as dotenv from 'dotenv';
import * as constants from '../utils/constants';
import { readFileSync, writeFileSync } from 'fs';
import { stringify } from 'envfile';

async function main() {
  // We reset the fork to have a fresh state
  await network.provider.request({
    method: 'hardhat_reset',
    params: [
      {
        forking: {
          jsonRpcUrl:
            'https://polygon-mainnet.g.alchemy.com/v2/' +
            process.env.KEY_ALCHEMY_POLYGON,
        },
      },
    ],
  });

  const PocketFaucet = await ethers.getContractFactory('PocketFaucet');
  const pocketFaucet = await upgrades.deployProxy(PocketFaucet, [
    constants.TOKEN_POLY.USDC,
  ]);
  await pocketFaucet.deployed();

  console.log('Contract deployed to ', pocketFaucet.address);

  // const file = readFileSync('../../.env');
  // const env = dotenv.parse(file);
  const env = {
    NEXT_PUBLIC_CONTRACT_ADDRESS: pocketFaucet.address,
  };
  writeFileSync('./.env', stringify(env));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
