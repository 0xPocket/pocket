import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { writeFileSync, readFileSync } from 'fs';
import path from 'path';

const ENV_PATH = path.resolve(__dirname, '../../../.env');

const TO_UPDATE = {
  CustomForwarder: 'NEXT_PUBLIC_TRUSTED_FORWARDER',
  PocketFaucet: 'NEXT_PUBLIC_CONTRACT_ADDRESS',
};

function updateEnvFile(environementKey: string, contractAddress: string) {
  const file = readFileSync(ENV_PATH, 'utf8');
  const lines = file.split('\n');
  let found = false;

  const newLines = lines.map((line) => {
    if (line.startsWith(environementKey) && !line.includes('#')) {
      found = true;
      return `${environementKey}=${contractAddress}`;
    }
    return line;
  });

  if (!found) {
    newLines.push(`${environementKey}=${contractAddress}`);
  }

  writeFileSync(ENV_PATH, newLines.join('\n'));
}

const func: DeployFunction = async function ({
  deployments,
}: HardhatRuntimeEnvironment) {
  const { get, all } = deployments;

  const deployed = await all();
  for (const [name, deployment] of Object.entries(deployed)) {
    console.log(name, deployment.address);
  }

  for (const [name, envKey] of Object.entries(TO_UPDATE)) {
    const deployment = await get(name);
    updateEnvFile(envKey, deployment.address);
  }
};

export default func;
func.tags = ['update-env', 'local'];
func.runAtTheEnd = true;
