// async function findBalanceOfSlot(address: string) {
// 	for (let i = 0; i <= maxSlot; i++) {
// 		const d = await provider.getStorageAt(
// 			tokenAddress,
// 			ethers.utils.solidityKeccak256(
// 				["uint256", "uint256"],
// 				[tokenHolderAddress, i] // key, slot (solidity)
// 			)
// 		);

// 		let n = ethers.constants.Zero;

// 		try {
// 			n = ethers.BigNumber.from(d);
// 		} catch (e) {
// 			/* */
// 		}

// 		if (n.eq(holderBal)) {
// 			if (verbose) {
// 				solSpinner.succeed(
// 					`Slot number ${i} corresponds to balanceOf for ${tokenSymbol} with solidity mapping format (key, slot)`
// 				);
// 			}
// 		}
// 	}
// }

export { }