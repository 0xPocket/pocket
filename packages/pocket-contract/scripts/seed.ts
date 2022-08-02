import { setAllowance, setErc20Balance } from '../utils/ERC20';
import * as constants from '../utils/constants';
import { parseUnits } from 'ethers/lib/utils';
import { ethers } from 'hardhat';
import { PocketFaucet__factory } from '../typechain-types';

const DAMIAN_MUSK = {
  address: '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec',
  privateKey:
    '0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd',
};

const XAVIER_MUSK = {
  address: '0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097',
  privateKey:
    '0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa',
};

const LOLA_MUSK = {
  address: '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
  privateKey:
    '0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61',
};

const ELON_MUSK = {
  address: '0xBcd4042DE499D14e55001CcbB24a551F3b954096',
  privateKey:
    '0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897',
};

async function main() {
  const tokenDecimals = 6;
  const parent = await ethers.getSigner(ELON_MUSK.address);
  const faucet = PocketFaucet__factory.connect(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
    parent
  );

  await faucet.addChild(
    parseUnits('100', tokenDecimals),
    1 * 1 * 5 * 6000,
    LOLA_MUSK.address
  );
  await faucet.addChild(
    parseUnits('10', tokenDecimals),
    1 * 1 * 5 * 60,
    DAMIAN_MUSK.address
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    parseUnits('100000', tokenDecimals).toString()
  );

  await faucet.addFunds(parseUnits('10', tokenDecimals), LOLA_MUSK.address);

  console.log('Contract seeding complete !');
}

main().catch((e) => console.error(e));
