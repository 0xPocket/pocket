import { BigNumber, Contract } from 'ethers';
import { impersonate, stopImpersonate } from './impersonate';
import * as ERC20 from '../artifacts/@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol/IERC20Upgradeable.json';
import { ethers } from 'hardhat';

export async function transferERC20(
  contractAddr: string,
  from: string,
  to: string,
  amount: string
) {
  const erc20 = new Contract(contractAddr, ERC20.abi);

  await impersonate(from);

  const sender = await ethers.getSigner(from);

  await erc20.connect(sender).transfer(to, BigNumber.from(amount).mul(1000000));

  await stopImpersonate(from);
}
