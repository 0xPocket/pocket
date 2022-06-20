import { BigNumber, Contract, Wallet } from 'ethers';
import { impersonate, stopImpersonate } from './impersonate';
// TO DO : database for abis
import { abi as ERC20Abi } from '../artifacts/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol/IERC20MetadataUpgradeable.json';
import { IERC20MetadataUpgradeable } from '../typechain-types/@openzeppelin/contracts-upgradeable/token/ERC20/extensions';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

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
  const decimals = await tokenContract.connect(account).decimals();
  const balance = await tokenContract
    .connect(account)
    .balanceOf(account.address);
  const newAmount = BigNumber.from(amount).mul(
    BigNumber.from('10').pow(decimals)
  );

  if (balance.gt(newAmount)) {
    await tokenContract
      .connect(account)
      .transfer(
        '0x04a8a22e5ef364c5237df13317c4f083f32c2cc4',
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
