import { BigNumberish, Signer, Wallet } from 'ethers';
import { PocketFaucet__factory, PocketFaucet } from '../typechain-types';
import config from 'config/network';

// import
class ParentContract {
  address: string;
  signer: Signer;
  contract: PocketFaucet;

  constructor(address: string, signer: Wallet) {
    this.contract = PocketFaucet__factory.connect(address, signer);
    this.address = signer.address;
    this.signer = signer;
  }

  // Helper functions
  getChildren = async () => {
    const childrenAddresses: string[] = [];
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
    childAddr: string,
    tokenIndex = 0
  ) => {
    const tx = await this.contract.populateTransaction.addChild(childAddr, {
      ceiling,
      periodicity,
      tokenIndex,
    });

    const populatedTransaction = await this.signer.populateTransaction(tx);
    return this.signer.signTransaction(populatedTransaction);
  };

  removeChild = (childAddr: string) => {
    return this.contract.removeChild(childAddr);
  };

  setActive = (active: boolean, childAddr: string) => {
    return this.contract.setActive(active, childAddr);
  };

  changeConfig = async (
    ceiling: BigNumberish,
    periodicity: BigNumberish,
    childAddr: string
  ) => {
    const tx = await this.contract.populateTransaction.changeConfig(
      childAddr,
      ceiling,
      periodicity
    );

    const populatedTransaction = await this.signer.populateTransaction(tx);
    return this.signer.signTransaction(populatedTransaction);
  };

  changeChildAddress = (oldAddr: string, newAddr: string) => {
    return this.contract.changeChildAddress(oldAddr, newAddr);
  };

  changeParentAddress = (newAddr: string) => {
    return this.contract.changeParentAddr(newAddr);
  };

  addFunds = async (childAddr: string, amountWithDecimals: BigNumberish) => {
    return this.contract.addFunds(childAddr, amountWithDecimals);
  };
}

export { ParentContract };
