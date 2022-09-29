import { getDecimals, setAllowance, setErc20Balance } from '../utils/ERC20';
import * as constants from '../utils/constants';
import { parseUnits } from 'ethers/lib/utils';
import { ethers } from 'hardhat';
import { PocketFaucet__factory } from '../typechain-types';
import { env } from 'config/env/server';

async function main() {
  if (env.NEXT_PUBLIC_NETWORK !== 'localhost') {
    console.log('Skipping seeding on non localhost network');
    return;
  }

  const tokenDecimals = await getDecimals(env.ERC20_ADDRESS);
  const parent = await ethers.getSigner(constants.ELON_MUSK.address);
  const faucet = PocketFaucet__factory.connect(
    env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    parent
  );

  await faucet.addChild(
    parseUnits('100', tokenDecimals),
    1 * 1 * 5 * 6000,
    constants.LOLA_MUSK.address
  );
  await faucet.addChild(
    parseUnits('10', tokenDecimals),
    1 * 1 * 5 * 60,
    constants.DAMIAN_MUSK.address
  );

  await setErc20Balance(
    constants.CHOSEN_TOKEN,
    parent,
    '3000',
    constants.CHOSEN_WHALE
  );

  await setAllowance(
    constants.CHOSEN_TOKEN,
    parent,
    env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    parseUnits('10', tokenDecimals).toString()
  );

  await faucet.addFunds(
    constants.LOLA_MUSK.address,
    parseUnits('10', tokenDecimals)
  );

  await setAllowance(
    constants.CHOSEN_TOKEN,
    parent,
    env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    '0'
  );
  console.log('Contract seeding complete !');
}

main().catch((e) => console.error(e));
