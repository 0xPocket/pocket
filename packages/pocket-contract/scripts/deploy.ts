import { ethers, upgrades } from 'hardhat';
import { readFileSync, writeFileSync } from 'fs';
import { env } from 'config/env/server';
import config from 'config/network';

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
  if (env.NEXT_PUBLIC_NETWORK !== 'localhost') {
    console.log('Skipping deployment on non localhost network');
    return;
  }

  console.log('Network selected :', env.NEXT_PUBLIC_NETWORK);

  const PocketFaucet = await ethers.getContractFactory('PocketFaucet');
  const pocketFaucet = await upgrades.deployProxy(PocketFaucet, [
    env.ERC20_ADDRESS,
    config['polygon-mumbai'].TRUSTED_FORWARDER,
  ]);
  await pocketFaucet.deployed();

  console.log('Proxy deployed to ', pocketFaucet.address);

  const file = readFileSync('../../.env');
  writeFileSync(
    '../../.env',
    replaceEnvInString(
      'NEXT_PUBLIC_CONTRACT_ADDRESS',
      pocketFaucet.address,
      file.toString()
    )
  );
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
