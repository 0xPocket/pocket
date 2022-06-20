import { ParentContract } from '../ts/Parent';

class ParentTester extends ParentContract {
  checkChildIsInit = async (childAddress: string) => {
    const childConfig = await this.getChildConfig(childAddress);
    if (childConfig.parent !== this.address) return false;
    const children = await this.getChildren();
    children.forEach((child) => {
      if (child === childAddress) return true;
    });
    return false;
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
