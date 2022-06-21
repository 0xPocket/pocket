import { BigNumber, BigNumberish, Contract, providers, Signer, Wallet } from 'ethers';
import { impersonate, stopImpersonate } from './impersonate';
// TO DO : database for abis
import { abi as ERC20Abi } from '../artifacts/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol/IERC20MetadataUpgradeable.json';
import { IERC20MetadataUpgradeable } from '../typechain-types/@openzeppelin/contracts-upgradeable/token/ERC20/extensions';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';
import { string } from 'hardhat/internal/core/params/argumentTypes';
import { token } from 'typechain-types/@openzeppelin/contracts-upgradeable';

export async function setErc20Balance(
  tokenAddr: string,
  account: SignerWithAddress | Wallet,
  amount: string,
  whaleAddr: string
) {
  const tokenContract = new Contract(
    tokenAddr,
    ERC20Abi
  ) as IERC20MetadataUpgradeable;
  await account.sendTransaction({
    to: whaleAddr,
    value: ethers.utils.parseEther("1")
  });
  const decimals = await tokenContract.connect(account).decimals();
  const balance = await tokenContract
    .connect(account)
    .balanceOf(account.address);
  const newAmount = BigNumber.from(amount).mul(
    BigNumber.from('10').pow(decimals)
  );
  const randomAddress = '0x04a8a22e5ef364c5237df13317c4f083f32c2cc4';
  if (balance.gt(newAmount)) {
    await tokenContract
      .connect(account)
      .transfer(
        randomAddress,
        balance.sub(newAmount)
      );
  } else if (balance.lt(newAmount)) {
    const sender = await impersonate(whaleAddr);
    await tokenContract
      .connect(sender)
      .transfer(account.address, newAmount.sub(balance));
    await stopImpersonate(whaleAddr);
  }
}

export async function sendErc20(
  tokenAddr: string,
  gasProvider: SignerWithAddress | Wallet,
  target: string,
  amount: string,
  whaleAddr: string
) {
  const tokenContract = new Contract(
    tokenAddr,
    ERC20Abi
  ) as IERC20MetadataUpgradeable;
  await gasProvider.sendTransaction({
    to: whaleAddr,
    value: ethers.utils.parseEther("1")
  });
  const decimals = await tokenContract.connect(gasProvider).decimals();
  const newAmount = BigNumber.from(amount).mul(
    BigNumber.from('10').pow(decimals)
  );
  const sender = await impersonate(whaleAddr);
  await tokenContract
    .connect(sender)
    .transfer(target, newAmount);
  await stopImpersonate(whaleAddr);
  
}
function amountInEther(amountInEther: any) {
  throw new Error('Function not implemented.');
}

export async function getDecimals(tokenAddr: string, provider: providers.JsonRpcProvider | Signer) {
  const tokenContract = new Contract(
    tokenAddr,
    ERC20Abi,
    provider
  ) as IERC20MetadataUpgradeable;
  return (await tokenContract.decimals());
}

export async function setAllowance(tokenAddr: string, account: Wallet, receiver: string, amount: string) {
  const tokenContract = new Contract(
    tokenAddr,
    ERC20Abi, account
  ) as IERC20MetadataUpgradeable;
  return (await tokenContract.connect(account).approve(receiver, amount));
}

export async function getBalance(tokenAddr: string, address: string, provider: providers.JsonRpcProvider) {
  const tokenContract = new Contract(
    tokenAddr,
    ERC20Abi,
    provider
  ) as IERC20MetadataUpgradeable;
  return await tokenContract.balanceOf(address);
}
