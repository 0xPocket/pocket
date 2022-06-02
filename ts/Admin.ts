import { Wallet } from "ethers";
import { PocketFaucet__factory } from "types";
import { PocketFaucet } from "types/PocketFaucet";

class AdminContract {
	library: any;
	abi: any;
	address: any;
	signer: any;
	contract: PocketFaucet;

	constructor(address: string, signer: Wallet) {
		this.contract = PocketFaucet__factory.connect(address, signer);
	};

	// Helper functions

	// Admin functions
	changeParentAddr = (oldAddr: string, newAddr: string) => {
		return this.contract.changeParentAddr(oldAddr, newAddr);
	};

	withdrawToken = (token: string, amount: string) => {
		return this.contract.withdrawToken(token, amount);
	};

	withdrawCoin = (amount: string) => {
		return this.contract.withdrawCoin(amount);
	};
}

export { AdminContract };