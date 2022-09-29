import { ethers } from 'hardhat';
import {
  getDecimals,
  setAllowance,
  setErc20Balance,
  stringToDecimalsVersion,
} from '../utils/ERC20';
import { ParentContract } from '../ts/Parent';
import { BigNumber, BigNumberish } from 'ethers';
import * as constants from '../utils/constants';
import { blockTimestamp } from '../utils/blockTimestamp';

class ParentTester extends ParentContract {
  checkChildIsInit = async (childAddress: string) => {
    let ret = false;
    const childConfig = await this.getChildConfig(childAddress);
    if (childConfig.parent !== this.address) return ret;
    const children = await this.getChildren();
    children.forEach((child) => {
      if (child === childAddress) ret = true;
    });
    return ret;
  };

  compareConfig = async (first: string, second: string) => {
    const firstConfig = await this.getChildConfig(first);
    const secondConfig = await this.getChildConfig(second);
    return (
      firstConfig.active === secondConfig.active &&
      firstConfig.balance === secondConfig.balance &&
      firstConfig.ceiling === secondConfig.ceiling &&
      firstConfig.lastClaim === secondConfig.lastClaim &&
      firstConfig.parent === secondConfig.parent
    );
  };

  getActive = async (address: string) => {
    const [active, , , , ,] = await this.getChildConfig(address);

    return active;
  };

  getChildCeiling = async (address: string) => {
    return (await this.getChildConfig(address)).ceiling;
  };

  getLastClaim = async (address: string) => {
    const [, , , lastClaim, ,] = await this.getChildConfig(address);
    return lastClaim;
  };

  getParent = async (address: string) => {
    const [, , , , , parent] = await this.getChildConfig(address);
    return parent;
  };

  getPeriodicity = async (address: string) => {
    const [, , , , periodicity] = await this.getChildConfig(address);
    return periodicity;
  };

  getNbChildren = async () => {
    return (await this.getChildren()).length;
  };

  changeConfigAndSend = async (
    ceiling: BigNumberish,
    periodicity: BigNumberish,
    childAddr: string
  ) => {
    const tx = await this.contract
      .connect(this.signer)
      .changeConfig(ceiling, periodicity, childAddr);
    await tx.wait();
  };

  addChildAndSend = async (
    ceiling: BigNumberish,
    periodicity: BigNumberish,
    childAddr: string
  ) => {
    const tx = await this.contract
      .connect(this.signer)
      .addChild(ceiling, periodicity, childAddr);
    await tx.wait();
  };

  addChildAndFundsAndSend = async (
    ceiling: BigNumberish,
    periodicity: BigNumberish,
    childAddr: string,
    amount: BigNumberish,
    token: string,
    whale: string | null
  ) => {
    if (whale != null) {
      await setErc20Balance(token, this.signer, amount.toString(), whale);

      await setAllowance(
        token,
        this.signer,
        this.contract.address,
        amount.toString()
      );
    }

    // TO DO : fix for new implementation
    // const amountWithDeci = await stringToDecimalsVersion(
    //   token,
    //   amount.toString()
    // );
    // const tx = await this.contract
    //   .connect(this.signer)
    //   .addChildAndFundsPermit(ceiling, periodicity, childAddr, amountWithDeci);
    // await tx.wait();
  };

  addStdChildAndSend = async (address: string, tokenAddr: string) => {
    const ceiling = ethers.utils.parseUnits('10', await getDecimals(tokenAddr));
    const periodicity = constants.TIME.WEEK;

    const tx = await this.contract
      .connect(this.signer)
      .addChild(ceiling, periodicity, address);
    await tx.wait();
  };

  addFundsToChild = async (
    childAddress: string,
    amount: string,
    token: string,
    whale: string
  ) => {
    await setErc20Balance(token, this.signer, amount, whale);
    await setAllowance(token, this.signer, this.contract.address, amount);

    const tx = await this.addFunds(
      childAddress,
      await stringToDecimalsVersion(token, amount)
    );
    await tx.wait();
  };

  calculateClaimable = async (childAddr: string) => {
    const fixedConf = await this.getChildConfig(childAddr);
    const conf = { ...fixedConf };
    const conf2 = conf;
    const timestamp = await blockTimestamp();
    let claimable = BigNumber.from(0);

    if (conf2.lastClaim.add(conf2.periodicity).gt(timestamp)) return claimable;
    while (conf2.lastClaim.add(conf2.periodicity).lte(timestamp)) {
      claimable = claimable.add(conf2.ceiling);
      conf2.lastClaim = conf2.lastClaim.add(conf2.periodicity);
    }
    return claimable.lt(conf2.balance) ? claimable : conf2.balance;
  };
}

export default ParentTester;
