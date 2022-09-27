import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { parseUnits } from 'ethers/lib/utils';
import { getDecimals, setAllowancev2, setErc20Balancev2 } from '../utils/ERC20';
import { env } from 'config/env/server';
import { ethers } from 'hardhat';
import { ForwaderAbi } from '../utils/forwarderAbi';

const func: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { execute, get } = deployments;
  const { elonmusk, lola, damian, xavier, whale, deployer } =
    await getNamedAccounts();

  console.log('test0');

  const tokenDecimals = await getDecimals(env.ERC20_ADDRESS);

  console.log(env.TRUSTED_FORWARDER);

  const forwarder = new ethers.Contract(env.TRUSTED_FORWARDER, ForwaderAbi);

  console.log('test14141');
  console.log('test1');

  const deployerSigner = await ethers.getSigner(deployer);

  await forwarder
    .connect(deployerSigner)
    .registerDomainSeparator('Pocket', '0.0.1');

  console.log('test2');

  await execute(
    'PocketFaucet',
    {
      from: elonmusk,
      autoMine: true,
    },
    'addChild',
    parseUnits('100', tokenDecimals),
    1 * 1 * 5 * 6000,
    lola
  );

  await execute(
    'PocketFaucet',
    {
      from: elonmusk,
      autoMine: true,
    },
    'addChild',
    parseUnits('10', tokenDecimals),
    1 * 1 * 5 * 60,
    damian
  );

  await setErc20Balancev2(env.ERC20_ADDRESS, whale, elonmusk, '3000');

  const pocketFaucet = await get('PocketFaucet');

  await setAllowancev2(
    env.ERC20_ADDRESS,
    elonmusk,
    pocketFaucet.address,
    parseUnits('10', tokenDecimals).toString()
  );

  await execute(
    'PocketFaucet',
    {
      from: elonmusk,
      autoMine: true,
    },
    'addFunds',
    parseUnits('10', tokenDecimals),
    lola
  );

  await setAllowancev2(
    env.ERC20_ADDRESS,
    elonmusk,
    env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    '0'
  );

  await execute(
    'PocketFaucet',
    {
      from: elonmusk,
      autoMine: true,
    },
    'addChild',
    parseUnits('10', tokenDecimals),
    1 * 1 * 5 * 6000,
    xavier
  );
};

export default func;
func.tags = ['seed', 'local'];
func.runAtTheEnd = true;
