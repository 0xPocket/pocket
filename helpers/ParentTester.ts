import { ethers } from 'hardhat';
import { getDecimals, setAllowance, setErc20Balance } from '../utils/ERC20';
import { ParentContract } from '../ts/Parent';
import { BigNumberish } from 'ethers';
import * as constants from "../utils/constants"

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

  getCeiling = async (address: string) => {
    const [, , ceiling, , , ] = await this.getChildConfig(address);
    return ceiling;
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
    const periodicity = 604800;
    await this.contract.connect(this.signer).addChild(ceiling, periodicity, address);
  }

  addFundsToChild = async (childAddress: string, amount : string, token: string, whale: string) => {
    await setErc20Balance(token, this.signer, amount , whale);
    await setAllowance(constants.TOKEN_POLY.JEUR, this.signer, this.contract.address, amount);
    await this.addFunds(amount, childAddress);
  } 
}

export default ParentTester;
