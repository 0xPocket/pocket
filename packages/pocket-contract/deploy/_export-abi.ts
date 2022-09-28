import { DeployFunction } from 'hardhat-deploy/types';
import { writeFileSync } from 'fs';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const ABI_EXPORT_PATH = './abi.ts';

const TO_EXPORT = ['PocketFaucet'];

const func: DeployFunction = async function ({
  deployments,
}: HardhatRuntimeEnvironment) {
  const { getArtifact } = deployments;

  let fileContent = '';

  for (const name of TO_EXPORT) {
    const artifact = await getArtifact(name);
    fileContent += `export const ${name}Abi = ${JSON.stringify(
      artifact.abi
    )} as const;\n`;
  }

  writeFileSync(ABI_EXPORT_PATH, fileContent);
};

export default func;
func.tags = ['export-abi'];
func.runAtTheEnd = true;
