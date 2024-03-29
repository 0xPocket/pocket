// import { ethers, upgrades } from 'hardhat';
// import { expect } from 'chai';
// import {
//   PocketFaucet__factory,
//   PocketFaucet,
//   PocketFaucetV2__factory,
// } from '../typechain-types';
// import * as constants from '../utils/constants';
// import { Wallet } from 'ethers';
// import ParentTester from '../ts/ParentTester';
// import config from 'config/network';

// describe('Deploy and tests on proxy functions', function () {
//   let child1: Wallet;
//   let parent1: ParentTester;
//   let parent1Wallet: Wallet;
//   let PocketFaucet_factory: PocketFaucet__factory, pocketFaucet: PocketFaucet;
//   let PocketFaucetV2_factory: PocketFaucetV2__factory;
//   const tokenAddr = constants.CHOSEN_TOKEN;

//   before(async function () {
//     child1 = new Wallet(constants.FAMILY_ACCOUNT.child1, ethers.provider);
//     parent1Wallet = new Wallet(
//       constants.FAMILY_ACCOUNT.parent1,
//       ethers.provider
//     );

//     PocketFaucet_factory = await ethers.getContractFactory('PocketFaucet');
//     pocketFaucet = (await upgrades.deployProxy(PocketFaucet_factory, [
//       tokenAddr,
//       config.localhost.TRUSTED_FORWARDER,
//     ])) as PocketFaucet;
//     await pocketFaucet.deployed();

//     PocketFaucetV2_factory = await ethers.getContractFactory('PocketFaucetV2');

//     parent1 = new ParentTester(pocketFaucet.address, parent1Wallet);
//   });

//   it('Should retrieve child and childConfig after upgrade', async function () {
//     await parent1.addStdChildAndSend(child1.address, tokenAddr);
//     const children = await parent1.getChildren();
//     const conf = await parent1.getChildConfig(child1.address);
//     await upgrades.upgradeProxy(pocketFaucet.address, PocketFaucetV2_factory);
//     expect(children[0]).to.be.equal((await parent1.getChildren())[0]);
//     const confNow = await parent1.getChildConfig(child1.address);
//     expect(conf.active).to.be.equal(confNow.active);
//     expect(conf.balance).to.be.equal(confNow.balance);
//     expect(conf.ceiling).to.be.equal(confNow.ceiling);
//     expect(conf.lastClaim).to.be.equal(confNow.lastClaim);
//     expect(conf.parent).to.be.equal(confNow.parent);
//   });
// });
