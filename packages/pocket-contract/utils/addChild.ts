import { ethers } from 'hardhat';
import {
  getDecimals,
  setErc20Balance,
  stringToDecimalsVersion,
} from '../utils/ERC20';
import { BigNumberish, VoidSigner } from 'ethers';
import * as constants from '../utils/constants';
import { PocketFaucet } from '../typechain-types';
import { User } from './testSetup';
import { generatePermitTx } from './permitHandler';

// TO DO : refactor
const addStdChildAndSend = async (
  connectedPF: PocketFaucet,
  childAddr: string,
  tokenAddr: string,
  tokenIndex = 0
) => {
  const ceiling = ethers.utils.parseUnits('10', await getDecimals(tokenAddr));
  const periodicity = constants.TIME.WEEK;
  const tx = await connectedPF.addChild(childAddr, {
    ceiling,
    periodicity,
    tokenIndex,
  });

  await tx.wait();
};

const addFundsPermit = async (
  childAddr: string,
  amount: BigNumberish,
  token: string,
  whale: string | null,
  parent: User,
  timestamp: number
) => {
  // TO DO : change for hardhat-deploy impersonate
  if (whale) {
    await setErc20Balance(
      token,
      parent.pocketFaucet.signer,
      amount.toString(),
      whale
    );
  }

  const amountWithDeci = await stringToDecimalsVersion(
    token,
    amount.toString()
  );

  const toSign = await generatePermitTx({
    erc20Address: token,
    provider: ethers.provider,
    owner: parent.address,
    spender: parent.pocketFaucet.address,
    value: amountWithDeci.toString(),
    domain: {
      name: 'USD Coin (PoS)',
      version: '1',
    },
    deadline: timestamp + 300,
  });

  const signature = ethers.utils.splitSignature(
    await (<VoidSigner>parent.pocketFaucet.signer)._signTypedData(
      toSign.domain,
      toSign.types,
      toSign.value
    )
  );

  const tx = await parent.pocketFaucet.addFundsPermit(
    childAddr,
    amountWithDeci,
    BigInt(toSign.value.deadline),
    signature.v,
    signature.r,
    signature.s
  );

  await tx.wait();
};

const addChildAndFundsPermitAndSend = async (
  ceiling: BigNumberish,
  periodicity: BigNumberish,
  childAddr: string,
  amount: BigNumberish,
  token: string,
  whale: string | null,
  parent: User,
  timestamp: number
) => {
  if (whale) {
    await setErc20Balance(
      token,
      parent.pocketFaucet.signer,
      amount.toString(),
      whale
    );
  }

  const amountWithDeci = await stringToDecimalsVersion(
    token,
    amount.toString()
  );

  const toSign = await generatePermitTx({
    erc20Address: token,
    provider: ethers.provider,
    owner: parent.address,
    spender: parent.pocketFaucet.address,
    value: amountWithDeci.toString(),
    domain: {
      name: 'USD Coin (PoS)',
      version: '1',
    },
    deadline: timestamp + 300,
  });

  const signature = ethers.utils.splitSignature(
    await (<VoidSigner>parent.pocketFaucet.signer)._signTypedData(
      toSign.domain,
      toSign.types,
      toSign.value
    )
  );

  const tx = await parent.pocketFaucet.addChildAndFundsPermit(
    childAddr,
    { ceiling, periodicity, tokenIndex: 0 },
    amountWithDeci,
    BigInt(toSign.value.deadline),
    signature.v,
    signature.r,
    signature.s
  );

  await tx.wait();
};

export { addStdChildAndSend, addChildAndFundsPermitAndSend, addFundsPermit };
