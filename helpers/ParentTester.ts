import { ParentContract } from '../ts/Parent';

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
}

export default ParentTester;
