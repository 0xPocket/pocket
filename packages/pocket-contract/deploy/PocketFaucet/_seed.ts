import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { parseUnits } from 'ethers/lib/utils';
import {
  getDecimals,
  setAllowancev2,
  setErc20Balancev2,
} from '../../utils/ERC20';
import { env } from 'config/env/server';

const func: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { execute, get } = deployments;
  const { elonmusk, lola, damian, xavier, whale } = await getNamedAccounts();

  const tokenDecimals = await getDecimals(env.ERC20_ADDRESS);

  await execute(
    'PocketFaucet',
    {
      from: elonmusk,
      autoMine: true,
    },
    'addChild',
    lola,
    {
      ceiling: parseUnits('100', tokenDecimals),
      periodicity: 1 * 1 * 5 * 6000,
      tokenIndex: 0,
    }
  );

  await execute(
    'PocketFaucet',
    {
      from: elonmusk,
      autoMine: true,
    },
    'addChild',
    damian,
    {
      ceiling: parseUnits('100', tokenDecimals),
      periodicity: 1 * 1 * 5 * 6000,
      tokenIndex: 0,
    }
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
    lola,
    parseUnits('10', tokenDecimals)
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
    xavier,
    {
      ceiling: parseUnits('10', tokenDecimals),
      periodicity: 1 * 1 * 5 * 6000,
      tokenIndex: 0,
    }
  );
};

export default func;
func.tags = ['seed', 'local'];
func.dependencies = ['PocketFaucet'];
