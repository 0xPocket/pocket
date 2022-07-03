import { ethers, upgrades } from 'hardhat';
import * as constants from '../utils/constants';
import { readFileSync, writeFileSync } from 'fs';

function replaceEnvInString(
  envName: string,
  newEnvContent: string,
  content: string
) {
  const envPositionStart = content.indexOf(envName);
  const envPositionEnd = content.indexOf('\n', envPositionStart);
  const toReplace = content.substring(envPositionStart, envPositionEnd);
  return content.replace(toReplace, `${envName}=${newEnvContent}`);
}

async function main() {
  const PocketFaucet = await ethers.getContractFactory('PocketFaucet');
  const pocketFaucet = await upgrades.deployProxy(PocketFaucet, [
    constants.TOKEN_POLY.USDC,
  ]);
  await pocketFaucet.deployed();

  console.log('Contract deployed to ', pocketFaucet.address);

  const file = readFileSync('../../.env');

  writeFileSync(
    '../../.env',
    replaceEnvInString(
      'NEXT_PUBLIC_CONTRACT_ADDRESS',
      pocketFaucet.address,
      file.toString()
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
