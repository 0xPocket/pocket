import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { env } from 'config/env/server';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const func: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
  ethers,
}: HardhatRuntimeEnvironment) {
  console.log(__dirname);

  const { deploy, get, catchUnknownSigner } = deployments;

  const { deployer } = await getNamedAccounts();

  console.log('the deployer', deployer);

  const forwarder = await get('CustomForwarder');

  console.log(env.ERC20_ADDRESS, forwarder.address);

  const test = await deploy('PocketFaucet', {
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
          args: [env.ERC20_ADDRESS, forwarder.address],
        },
      },
    },
  });
  const admin = await ethers.getContract('DefaultProxyAdmin');
  console.log(await admin.owner());
  console.log('deployer :', deployer);
};
export default func;
func.tags = ['PocketFaucet'];
func.dependencies = ['CustomForwarder'];
