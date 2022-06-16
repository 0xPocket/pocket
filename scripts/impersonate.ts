import * as hre from "hardhat";

export function impersonate(address: string) {
	return hre.network.provider.request({
		method: "hardhat_impersonateAccount",
		params: [address],
	});
}

export function stopImpersonate(address: string) {
	return hre.network.provider.request({
		method: "hardhat_stopImpersonatingAccount",
		params: [address],
	});
}
