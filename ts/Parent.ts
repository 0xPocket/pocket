import { BigNumber, BigNumberish, Signer, Wallet } from 'ethers';
import { PocketFaucet__factory, PocketFaucet } from '../typechain-types';

// import
class ParentContract {
  // library: any;
  // abi: any;
  address: string;
  signer: Signer;
  // signer: any;
  contract: PocketFaucet;

  constructor(address: string, signer: Wallet) {
    this.contract = PocketFaucet__factory.connect(address, signer);
    this.address = signer.address;
    this.signer = signer;
  }

  // Helper functions
  getChildren = async () => {
    let childrenAddresses: string[] = [];
    const length: number = await this.getNumberOfChildren();
    for (let i = 0; i < length; i++) {
      childrenAddresses.push(
        await this.contract.parentToChildren(this.address, i)
      );
    }

    return childrenAddresses;
  };

  getChildConfig = (childAddr: string) => {
    return this.contract.childToConfig(childAddr);
  };

  getChildBalance = async (childAddr: string) => {
    return (await this.getChildConfig(childAddr)).balance;
  };

  getNumberOfChildren = async () => {
    return (await this.contract.getNumberChildren(this.address)).toNumber();
  };

  // TO DO :
  // getClaimable()

  // Parent functions
  addChild = async (
    ceiling: BigNumberish,
    periodicity: BigNumberish,
    childAddr: string
  ) => {
    const tx = await this.contract.populateTransaction.addChild(
      ceiling,
      periodicity,
      childAddr
    );

    const populatedTransaction = await this.signer.populateTransaction(tx);
    return this.signer.signTransaction(populatedTransaction);
  };

  removeChild = (childAddr: string) => {
    return this.contract.removeChild(childAddr);
  };

  activateSwitch = (active: boolean, childAddr: string) => {
    return this.contract.setActive(active, childAddr);
  };

  changeConfig = (
    ceiling: BigNumberish,
    periodicity: BigNumberish,
    childAddr: string
  ) => {
    return this.contract.changeConfig(ceiling, periodicity, childAddr);
  };

  changeChildAddress = (oldAddr: string, newAddr: string) => {
    return this.contract.changeChildAddress(oldAddr, newAddr);
  };

  addFunds = async (amount: BigNumberish, childAddr: string) => {
    return this.contract.addFunds(amount, childAddr);
  };
}

export { ParentContract };
