import { Wallet } from "ethers";
import { PocketFaucet__factory } from "./types";
import { PocketFaucet } from "types/PocketFaucet";

class ChildContract {
	library: any;
	abi: any;
	address: any;
	signer: any;
	contract: PocketFaucet;

	constructor(address: string, signer: Wallet) {
		this.contract = PocketFaucet__factory.connect(address, signer);
	};


	// Helper functions
	getConfig = () => {
		return this.contract.childToConfig(this.address);
	};

	getParent = async () => {
		return (await this.getConfig()).parent;
	};

	getPocketBalance = async () => {
		return (await this.getConfig()).balance;
	};

	getLastClaim = async () => {
		return (await this.getConfig()).lastClaim;
	};

	// TO DO :
	// getClaimable()

	// Child functions
	claim = () => {
		return this.contract.claim();
	};
}

export { ChildContract };
