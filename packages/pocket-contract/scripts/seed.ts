import { BigNumber } from 'ethers';
import { setErc20Balance } from '../utils/ERC20';
import * as constants from '../utils/constants';
import { parseUnits } from 'ethers/lib/utils';
import { ethers } from 'hardhat';
import {
  impersonateAccount,
  setBalance,
  stopImpersonatingAccount,
} from '@nomicfoundation/hardhat-network-helpers';
import { PocketFaucet__factory } from '../typechain-types';

const DAMIAN_MUSK = {
  publicKey: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
  privateKey:
    '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
};

const SOLAL_DUNCKEL = {
  publicKey: '0x9DA96cb647116313129EAb5BB81E87940fAD6f60',
};

async function main() {
  // Set Balance
  await setBalance(
    SOLAL_DUNCKEL.publicKey,
    BigNumber.from('3000').mul(BigNumber.from('10').pow(18)).toHexString()
  );

  // Impersonate Account
  await impersonateAccount(SOLAL_DUNCKEL.publicKey);

  const signer = await ethers.getSigner(SOLAL_DUNCKEL.publicKey);

  const parent = PocketFaucet__factory.connect(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
    signer
  );

  await parent.addChild(
    parseUnits('20', 6),
    1 * 1 * 5 * 60,
    DAMIAN_MUSK.publicKey
  );

  await setErc20Balance(
    constants.CHOSEN_TOKEN,
    signer,
    '3000',
    constants.CHOSEN_WHALE
  );

  await stopImpersonatingAccount(SOLAL_DUNCKEL.publicKey);

  console.log('Contract seeding complete !');
}

main().catch((e) => console.error(e));
