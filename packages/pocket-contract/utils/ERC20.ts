import { BigNumber, Contract, Signer, Wallet } from 'ethers';
import { impersonate, stopImpersonate } from './impersonate';
import { abi as ERC20Abi } from '../artifacts/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol/IERC20MetadataUpgradeable.json';
import { IERC20MetadataUpgradeable } from '../typechain-types/@openzeppelin/contracts-upgradeable/token/ERC20/extensions';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';
import hardhat from 'hardhat';

export async function setErc20Balance(
  tokenAddr: string,
  account: Signer | Wallet,
  amount: string,
  whaleAddr: string
) {
  const tokenContract = new Contract(
    tokenAddr,
    ERC20Abi
  ) as IERC20MetadataUpgradeable;
  const tx = await account.sendTransaction({
    to: whaleAddr,
    value: ethers.utils.parseEther('1'),
  });

  await tx.wait();
  const balance = await tokenContract
    .connect(account)
    .balanceOf(await account.getAddress());
  const newAmount = await stringToDecimalsVersion(tokenAddr, amount);
  const randomAddress = '0x04a8a22e5ef364c5237df13317c4f083f32c2cc4';
  if (balance.gt(newAmount)) {
    await tokenContract
      .connect(account)
      .transfer(randomAddress, balance.sub(newAmount));
  } else if (balance.lt(newAmount)) {
    const sender = await impersonate(whaleAddr);
    await tokenContract
      .connect(sender)
      .transfer(await account.getAddress(), newAmount.sub(balance));

    await stopImpersonate(whaleAddr);
  }
}

export async function setErc20Balancev2(
  tokenAddr: string,
  from: string,
  to: string,
  amount: string
) {
  const tokenContract = new Contract(
    tokenAddr,
    ERC20Abi
  ) as IERC20MetadataUpgradeable;

  const { whale } = await hardhat.getNamedAccounts();
  const fromSigner = await hardhat.ethers.getSigner(from);

  const tx = await fromSigner.sendTransaction({
    to: whale,
    value: ethers.utils.parseEther('1'),
  });

  await tx.wait();

  console.log('erc20 balance 1');

  // const balance = await tokenContract.balanceOf(to);
  console.log('erc20 balance 1.5');

  const newAmount = await stringToDecimalsVersion(tokenAddr, amount);

  console.log('erc20 balance 2');

  const tx2 = await tokenContract.connect(fromSigner).transfer(to, newAmount);
  await tx2.wait();
}

export async function setAllowancev2(
  tokenAddr: string,
  from: string,
  to: string,
  amount: string
) {
  const tokenContract = new Contract(
    tokenAddr,
    ERC20Abi
  ) as IERC20MetadataUpgradeable;
  const fromSigner = await hardhat.ethers.getSigner(from);
  const tx = await tokenContract
    .connect(fromSigner)
    .approve(to, await stringToDecimalsVersion(tokenAddr, amount));
  await tx.wait();
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
    value: ethers.utils.parseEther('1'),
  });
  const decimals = await tokenContract.connect(gasProvider).decimals();
  const newAmount = BigNumber.from(amount).mul(
    BigNumber.from('10').pow(decimals)
  );
  const sender = await impersonate(whaleAddr);
  await tokenContract.connect(sender).transfer(target, newAmount);
  await stopImpersonate(whaleAddr);
}

export async function getDecimals(tokenAddr: string) {
  const tokenContract = new Contract(
    tokenAddr,
    ERC20Abi,
    ethers.provider
  ) as IERC20MetadataUpgradeable;
  return await tokenContract.decimals();
}

export async function stringToDecimalsVersion(
  tokenAddr: string,
  amount: string
) {
  return ethers.utils.parseUnits(amount, await getDecimals(tokenAddr));
}

export async function setAllowance(
  tokenAddr: string,
  account: Wallet | Signer,
  receiver: string,
  amount: string
) {
  const tokenContract = new Contract(
    tokenAddr,
    ERC20Abi,
    account
  ) as IERC20MetadataUpgradeable;
  const tx = await tokenContract
    .connect(account)
    .approve(receiver, await stringToDecimalsVersion(tokenAddr, amount));
  await tx.wait();
}

export async function getERC20Balance(tokenAddr: string, address: string) {
  const tokenContract = new Contract(
    tokenAddr,
    ERC20Abi,
    ethers.provider
  ) as IERC20MetadataUpgradeable;
  return await tokenContract.balanceOf(address);
}
