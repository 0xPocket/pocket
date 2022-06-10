import { ethers, upgrades } from 'hardhat';
import { expect } from 'chai';
import { PocketFaucet__factory, PocketFaucet } from "../typechain-types";

describe('Deploy', function () {
	it("Should have set baseToken", async function () {
		const PocketFaucet: PocketFaucet__factory = await ethers.getContractFactory('PocketFaucet');
		const pocketFaucet = await upgrades.deployProxy(PocketFaucet, ["0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c"]) as PocketFaucet;
		await pocketFaucet.deployed();

		expect(await pocketFaucet.baseToken()).to.equal('0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c');
	});
});
