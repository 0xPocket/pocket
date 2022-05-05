import { Contract } from "ethers";
import { BigNumberish } from "ethers";

export interface ChildConfig {
  ceiling: BigNumberish;
  claimable: BigNumberish;
  active: Boolean;
  lactClaim: BigNumberish;
  parent: string;
}
// import 
class ParentContract {
  library: any; // TO DO move
  abi: any; // TO DO move
  address: any; // TO DO move
  signer: any;
  UID: string;
  pocketFaucet: Contract;

  constructor() {
    this.pocketFaucet = new Contract(this.address, this.abi);
  }

  getPocketFaucetContract = () => {
    return (this.pocketFaucet);
  }

  getBalance = async () => {
    return await this.pocketFaucet.parentsBalance(this.UID)
  };

  getChildren = async () => {
    // TO DO need contract modification
  }

  rmChild = async (childAddress: string) => {
    return await this.pocketFaucet.rmChild(childAddress);
  }

  addNewChild = async (config: ChildConfig, childAddress: string) => {
    return await this.pocketFaucet.addNewChild(config, childAddress);
  }

  changeConfig = async (config: ChildConfig, childAddress: string) => {
    return await this.pocketFaucet.changeConfig(config, childAddress);
  }

  changeAddress = async (oldAddr: string, newAddr: string) => {
    return await this.pocketFaucet.changeAddress(oldAddr, newAddr);
  }
}

export { ParentContract };
