import { DeployFunction } from 'hardhat-deploy/types';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const ABI_EXPORT_PATH = './abi';

const TO_EXPORT = [
  'PocketFaucet',
  'Forwarder',
  'ERC20Permit',
  'ProxyAdmin',
  'TransparentUpgradeableProxy',
];

const func: DeployFunction = async function ({
  deployments,
}: HardhatRuntimeEnvironment) {
  const { getArtifact } = deployments;

  let indexContent = '';

  if (!existsSync(ABI_EXPORT_PATH)) {
    mkdirSync(ABI_EXPORT_PATH);
  }

  for (const name of TO_EXPORT) {
    const artifact = await getArtifact(name);
    const fileContent = `export const ${name}Abi = ${JSON.stringify(
      artifact.abi,
      null,
      2
    )} as const;\n`;
    writeFileSync(`${ABI_EXPORT_PATH}/${name}.ts`, fileContent);
    indexContent += `export * from './${name}';\n`;
  }

  writeFileSync(`${ABI_EXPORT_PATH}/index.ts`, indexContent);
};

export default func;
func.tags = ['export-abi'];
func.runAtTheEnd = true;
