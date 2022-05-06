import { Contract } from "ethers";
import { PocketFaucet } from "./types/PocketFaucet";

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
    return this.getPocketFaucetContract().parentsBalance(this.UID);
  };

  getChildren = async () => {
    // TO DO need contract modification
  };

  rmChild = async (childAddress: string) => {
    return this.getPocketFaucetContract().rmChild(childAddress);
  };

  addNewChild = async (
    config: PocketFaucet.ConfigStruct,
    childAddress: string
  ) => {
    return this.getPocketFaucetContract().addNewChild(config, childAddress);
  };

  changeConfig = async (
    config: PocketFaucet.ConfigStruct,
    childAddress: string
  ) => {
    return this.getPocketFaucetContract().changeConfig(config, childAddress);
  };

  changeAddress = async (oldAddr: string, newAddr: string) => {
    return this.getPocketFaucetContract().changeAddress(oldAddr, newAddr);
  };
}

export { ParentContract };
