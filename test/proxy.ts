import { ethers, upgrades } from 'hardhat';
import { expect } from 'chai';
import { PocketFaucet__factory, PocketFaucet } from "../typechain-types";
import { ProxyAdmin } from "../typechain-types";
import * as constants from "../utils/constants"
import { Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { setErc20Balance } from '../utils/ERC20';
import { abi as proxyAbi } from "../artifacts/@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol/ProxyAdmin.json"

describe('Deploy', function () {
	let PocketFaucet_factory: PocketFaucet__factory, pocketFaucet: PocketFaucet;
	let admin: SignerWithAddress, testAccount1: SignerWithAddress, badActor: SignerWithAddress;
	let proxyAdmin: ProxyAdmin;

	before(async function () {
		[admin, testAccount1, badActor] = await ethers.getSigners();
		PocketFaucet_factory = await ethers.getContractFactory('PocketFaucet');
		pocketFaucet = await upgrades.deployProxy(PocketFaucet_factory, [constants.TOKEN_POLY.USDC]) as PocketFaucet;
		await pocketFaucet.deployed();

		const proxyAddr = (await upgrades.admin.getInstance()).address;
		proxyAdmin = new Contract(proxyAddr, proxyAbi) as ProxyAdmin;
	});

	// it("Should have set baseToken", async function () {
	// 	expect(await pocketFaucet.baseToken()).to.equal(constants.TOKEN_POLY.USDC);
	// });

	// it("Should have set good admin for proxy + owner of proxyAdmin", async function () {
	// 	expect(await proxyAdmin.owner()).to.be.equal(admin.address);
	// 	expect(await proxyAdmin.getProxyAdmin(pocketFaucet.address)).to.be.equal(proxyAdmin.address);
	// });

	describe('changeProxyAdmin', function () {
		// it('Should fail to change proxy admin if its not the proxy owner', async function () {
		// 	await expect(
		// 		proxyAdmin.connect(badActor).changeProxyAdmin(pocketFaucet.address, testAccount1.address)
		// 	).to.be.revertedWith("Ownable: caller is not the owner");
		// });

		it('changes proxy admin', async function () {
			await upgrades.admin.transferProxyAdminOwnership(testAccount1.address);
			expect(await upgrades.erc1967.getAdminAddress(pocketFaucet.address)).to.be.equal(testAccount1.address);
			await proxyAdmin.connect(testAccount1).changeProxyAdmin(pocketFaucet.address, admin.address);
			// expect(await upgrades.erc1967.getAdminAddress(pocketFaucet.address)).to.be.equal(testAccount1.address);
		});
	});

	// describe('#getProxyImplementation', function () {
	// 	it('returns proxy implementation address', async function () {
	// 		const implementationAddress = await this.proxyAdmin.getProxyImplementation(this.proxy.address);
	// 		expect(implementationAddress).to.be.equal(this.implementationV1.address);
	// 	});
	// });

	// describe('#upgrade', function () {
	// 	context('with unauthorized account', function () {
	// 		it('fails to upgrade', async function () {
	// 			await expectRevert(
	// 				this.proxyAdmin.upgrade(this.proxy.address, this.implementationV2.address, { from: anotherAccount }),
	// 				'caller is not the owner',
	// 			);
	// 		});
	// 	});

	// 	context('with authorized account', function () {
	// 		it('upgrades implementation', async function () {
	// 			await this.proxyAdmin.upgrade(this.proxy.address, this.implementationV2.address, { from: proxyAdminOwner });
	// 			const implementationAddress = await this.proxyAdmin.getProxyImplementation(this.proxy.address);
	// 			expect(implementationAddress).to.be.equal(this.implementationV2.address);
	// 		});
	// 	});
	// });


});
