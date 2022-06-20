import { ethers, upgrades } from 'hardhat';
import * as dotenv from 'dotenv';
import * as constants from "../utils/constants"
import { readFileSync, writeFileSync } from 'fs';
import { stringify } from 'envfile';

async function main() {
	const PocketFaucet = await ethers.getContractFactory("PocketFaucet");
	const pocketFaucet = await upgrades.deployProxy(PocketFaucet, [
		constants.TOKEN_POLY.USDC,
	]);
	await pocketFaucet.deployed();

	const file = readFileSync(".env");
	const env = dotenv.parse(file);
	env.NEXT_PUBLIC_CONTRACT_ADDRESS = pocketFaucet.address;
	writeFileSync(".env", stringify(env));
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
