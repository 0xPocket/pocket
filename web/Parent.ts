import { Contract } from "ethers";
import { BigNumberish } from "ethers";
import { AddNewChildRequest, PocketFaucet } from "types/PocketFaucet";

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

  getPocketFaucetContract = (): PocketFaucet | Contract => {
    return new Contract(this.address, this.abi, this.signer);
  };

  getBalance = async () => {
    return await this.getPocketFaucetContract().parentsBalance(this.UID);
  };

  getChildren = async () => {
    // TO DO need contract modification
  };

  rmChild = async (childAddress: string) => {
    return await this.getPocketFaucetContract().rmChild(childAddress);
  };

  addChild = async (config: AddNewChildRequest, childAddress: string) => {
    config.
    return await this.getPocketFaucetContract().addChild(
      {}
    );
  };

  changeConfig = async (config: ChildConfig, childAddress: string) => {
    return await this.getPocketFaucetContract().changeConfig(
      config,
      childAddress
    );
  };

  changeAddress = async (oldAddr: string, newAddr: string) => {
    return await this.getPocketFaucetContract().changeAddress(oldAddr, newAddr);
  };
}

export { ParentContract };
