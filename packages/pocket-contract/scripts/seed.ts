import { getDecimals, setAllowance, setErc20Balance } from '../utils/ERC20';
import * as constants from '../utils/constants';
import { parseUnits } from 'ethers/lib/utils';
import { ethers } from 'hardhat';
import { PocketFaucet__factory } from '../typechain-types';

async function main() {
  const tokenDecimals = await getDecimals(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.NEXT_PUBLIC_CHOSEN_ERC20!
  );
  const parent = await ethers.getSigner(constants.ELON_MUSK.address);
  const faucet = PocketFaucet__factory.connect(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
    parent
  );

  console.log(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

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

  console.log(constants.CHOSEN_TOKEN);

  await setErc20Balance(
    constants.CHOSEN_TOKEN,
    parent,
    '3000',
    constants.CHOSEN_WHALE
  );

  await setAllowance(
    constants.CHOSEN_TOKEN,
    parent,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    parseUnits('10', tokenDecimals).toString()
  );

  await setAllowance(
    constants.CHOSEN_TOKEN,
    parent,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    '0'
  );

  await faucet.addFunds(
    parseUnits('10', tokenDecimals),
    constants.LOLA_MUSK.address
  );

  await setAllowance(
    constants.CHOSEN_TOKEN,
    parent,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    '0'
  );
  console.log('Contract seeding complete !');
}

main().catch((e) => console.error(e));
