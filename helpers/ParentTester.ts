import { ethers } from 'hardhat';
import { getDecimals } from '../utils/ERC20';
import { ParentContract } from '../ts/Parent';
import { BigNumberish } from 'ethers';

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
}

export default ParentTester;
