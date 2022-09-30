import { ethers } from 'hardhat';
import {
  getDecimals,
  setAllowance,
  setErc20Balance,
  stringToDecimalsVersion,
} from '../utils/ERC20';
import { ParentContract } from '../ts/Parent';
import { BigNumber, BigNumberish, VoidSigner } from 'ethers';
import * as constants from '../utils/constants';
import { blockTimestamp } from '../utils/blockTimestamp';
import { generatePermitTx } from '../../../apps/web/utils/generatePermitTx';
import { ERC20PermitAbi } from '../abi/ERC20Permit';
import { PocketFaucet } from '../typechain-types';

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

export default addStdChildAndSend;
