import { ethers, upgrades } from 'hardhat';
import { expect } from 'chai';
import { PocketFaucet__factory, PocketFaucet } from "../typechain-types";
import * as constants from "../utils/constants"
import { Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('Deploy', function () {
	let PocketFaucet_factory: PocketFaucet__factory, pocketFaucet: PocketFaucet;
	let admin: SignerWithAddress;
	let proxyAdmin: Contract;

	before(async function () {
		[admin] = await ethers.getSigners();
		PocketFaucet_factory = await ethers.getContractFactory('PocketFaucet');
		pocketFaucet = await upgrades.deployProxy(PocketFaucet_factory, [constants.token_poly.usdc]) as PocketFaucet;
		await pocketFaucet.deployed();

		proxyAdmin = await upgrades.admin.getInstance();
	});

	it("Should have set baseToken", async function () {
		expect(await pocketFaucet.baseToken()).to.equal(constants.token_poly.usdc);
	});

	it("Should have set good admin", async function () {
		console.log(admin.address, " admin address")
		console.log(pocketFaucet.address, " pocketFaucet(proxy) address")
		console.log(await upgrades.erc1967.getImplementationAddress(pocketFaucet.address), " getImplementationAddress")
		console.log(await upgrades.erc1967.getAdminAddress(pocketFaucet.address), " getAdminAddress")
	});

});
