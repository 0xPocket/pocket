import { Wallet } from "ethers";
import { PocketFaucet__factory } from "types";
import { PocketFaucet } from "./types/PocketFaucet";

// import
class ParentContract {
  library: any; // TO DO move
  abi: any; // TO DO move
  address: any; // TO DO move
  signer: any;
  UID: string;
  contract: PocketFaucet;

  constructor(address: string, signer: Wallet) {
    this.contract = PocketFaucet__factory.connect(address, signer);
  }

  // getPocketFaucetContract = (): PocketFaucet | Contract => {
  //   return new Contract(this.address, this.abi, this.signer);
  // };

  // getBalance = async () => {
  //   return this.getPocketFaucetContract().parentsBalance(this.UID);
  // };

  getChildren = async () => {
    // TO DO need contract modification
  };

  // rmChild = async (childAddress: string) => {
  //   return this.getPocketFaucetContract().rmChild(childAddress);
  // };

  getNumberOfChildren = (address: string) => {
    return this.contract.getNumberChildren(address).then((res) => {
      return res.toNumber();
    });
  };

  addNewChild = async (
    config: PocketFaucet.ConfigStruct,
    childAddress: string
  ) => {
    return this.contract.addNewChild(config, childAddress);
  };

  // changeConfig = async (
  //   config: PocketFaucet.ConfigStruct,
  //   childAddress: string
  // ) => {
  //   return this.getPocketFaucetContract().changeConfig(config, childAddress);
  // };

  // changeAddress = async (oldAddr: string, newAddr: string) => {
  //   return this.getPocketFaucetContract().changeAddress(oldAddr, newAddr);
  // };
}

export { ParentContract };
