import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { env } from 'config/env/server';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const func: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy('PocketFaucet', {
    from: deployer,
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks'
    args: [],
    proxy: {
      owner: deployer,
      proxyContract: 'OpenZeppelinTransparentProxy',
      execute: {
        init: {
          methodName: 'initialize',
          args: [env.ERC20_ADDRESS, env.TRUSTED_FORWARDER],
        },
      },
    },
  });
};
export default func;
func.tags = ['PocketFaucet'];
