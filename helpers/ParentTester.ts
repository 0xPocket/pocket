import { ethers } from 'hardhat';
import { getDecimals, setAllowance, setErc20Balance, stringToDecimalsVersion } from '../utils/ERC20';
import { ParentContract } from '../ts/Parent';
import { BigNumber, BigNumberish } from 'ethers';
import * as constants from "../utils/constants"
import { blockTimestamp } from '../utils/blockTimestamp';
import { config } from 'dotenv';

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
    const [active, , , , , ] = await this.getChildConfig(address);
    return active;
  }

  getChildCeiling = async (address: string) => {
    return (await this.getChildConfig(address)).ceiling;
  }

  getLastClaim = async (address: string) => {
    const [, , , lastClaim, , ] = await this.getChildConfig(address);
    return lastClaim;
  }

  getParent = async (address: string) => {
    const [, , , , , parent] = await this.getChildConfig(address);
    return parent;
  }

  getPeriodicity = async (address: string) => {
    const [, , , , periodicity, ] = await this.getChildConfig(address);
    return periodicity;
  }

  getNbChildren = async () => {
    return (await this.getChildren()).length;
  }

  changeConfigAndSend = async (
    ceiling: BigNumberish,
    periodicity: BigNumberish,
    childAddr: string
  ) => {
    await this.contract.connect(this.signer).changeConfig(ceiling, periodicity, childAddr);
  };
  
  addChildAndSend = async (
    ceiling: BigNumberish,
    periodicity: BigNumberish,
    childAddr: string
  ) => {
    await this.contract.connect(this.signer).addChild(ceiling, periodicity, childAddr);
  };

  addStdChildAndSend = async (address: string, tokenAddr: string) => {
    const ceiling = ethers.utils.parseUnits("10",  await getDecimals(tokenAddr, this.signer));
    const periodicity = constants.TIME.WEEK;
    await this.contract.connect(this.signer).addChild(ceiling, periodicity, address);
  }

  addFundsToChild = async (childAddress: string, amount : string, token: string, whale: string) => {
    const amountWithDeci = await stringToDecimalsVersion(token, this.signer, amount )
    await setErc20Balance(token, this.signer, amount , whale);
    await setAllowance(constants.TOKEN_POLY.JEUR, this.signer, this.contract.address, amountWithDeci.toString());
    await this.addFunds(amountWithDeci.toString(), childAddress);
  } 

  calculateClaimable = async (childAddr: string) => {
    let fixedConf = await this.getChildConfig(childAddr);
    let conf = {...fixedConf};
    let conf2 = conf;
    const timestamp = await blockTimestamp();
    let claimable = BigNumber.from(0);

    if (conf2.lastClaim.add(conf2.periodicity).gt(timestamp)) return claimable
    while (conf2.lastClaim.add(conf2.periodicity).lte(timestamp)) {
      claimable = claimable.add(conf2.ceiling);
      conf2.lastClaim = conf2.lastClaim.add(conf2.periodicity);
    }
    return claimable.lt(conf2.balance) ? claimable : conf2.balance;
  }
}

export default ParentTester;
