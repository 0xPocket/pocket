import { ethers, upgrades } from 'hardhat';
import { readFileSync, writeFileSync } from 'fs';
import * as constants from '../utils/constants';

function replaceEnvInString(
  envName: string,
  newEnvContent: string,
  content: string
) {
  let index = 0;
  while (1) {
    const tmp = content.indexOf('# ' + envName, index);
    if (tmp === -1) break;
    index = tmp + 3;
  }
  const envPositionStart = content.indexOf(envName, index);
  const envPositionEnd = content.indexOf('\n', envPositionStart);
  const toReplace = content.substring(envPositionStart, envPositionEnd);
  return content.replace(toReplace, `${envName}=${newEnvContent}`);
}

async function main() {
  console.log('Network selected :', constants.CHOSEN);

  const PocketFaucet = await ethers.getContractFactory('PocketFaucet');
  const pocketFaucet = await upgrades.deployProxy(PocketFaucet, [
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.NEXT_PUBLIC_CHOSEN_ERC20!,
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
