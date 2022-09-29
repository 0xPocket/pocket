/* eslint-disable no-unused-vars */
import { assert, expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { Wallet } from 'ethers';
import ParentTester from '../ts/ParentTester';
import * as constants from '../utils/constants';
import { PocketFaucet__factory, PocketFaucet } from '../typechain-types';
import config from 'config/network';

describe('Testing conf changement', function () {
  let child1: Wallet, child2: Wallet;
  let parent1: ParentTester;
  let PocketFaucet_factory: PocketFaucet__factory, pocketFaucet: PocketFaucet;
  let parent1Wallet: Wallet;
  const tokenAddr = constants.CHOSEN_TOKEN;

  before(async function () {
    child1 = new Wallet(constants.FAMILY_ACCOUNT.child1, ethers.provider);
    child2 = new Wallet(constants.FAMILY_ACCOUNT.child2, ethers.provider);

    PocketFaucet_factory = await ethers.getContractFactory('PocketFaucet');
    pocketFaucet = (await upgrades.deployProxy(PocketFaucet_factory, [
      tokenAddr,
      config.localhost.TRUSTED_FORWARDER,
    ])) as PocketFaucet;
    await pocketFaucet.deployed();
    parent1Wallet = new Wallet(
      constants.FAMILY_ACCOUNT.parent1,
      ethers.provider
    );
    parent1 = new ParentTester(pocketFaucet.address, parent1Wallet);
    await parent1.addStdChildAndSend(child1.address, tokenAddr);
  });

  it('Should revert because new child addr is zero', async function () {
    await expect(
      parent1.changeConfigAndSend(0, 0, ethers.constants.AddressZero)
    ).to.be.revertedWith('!_areRelated: null child address');
  });

  it('Should revert because child2 is not set for this parent', async function () {
    await expect(
      parent1.changeConfigAndSend(0, 0, child2.address)
    ).to.be.revertedWith("!_areRelated: child doesn't match");
  });

  it('Should revert because child1 is not set anymore', async function () {
    await parent1.removeChild(child1.address);
    await expect(
      parent1.changeConfigAndSend(0, 0, child1.address)
    ).to.be.revertedWith("!_areRelated: child doesn't match");
  });

  it('Should change ceiling', async function () {
    await parent1.addStdChildAndSend(child1.address, tokenAddr);
    const ceilingBefore = await parent1.getChildCeiling(child1.address);
    await parent1.changeConfigAndSend(10, 1, child1.address);
    const ceilingAfter = await parent1.getChildCeiling(child1.address);
    assert(!ceilingAfter.eq(ceilingBefore), 'Ceiling value did not change');
  });

  it('Should not change lastClaim', async function () {
    const lastClaimBefore = await parent1.getLastClaim(child1.address);
    await parent1.changeConfigAndSend(20, 1, child1.address);
    const lastClaimAfter = await parent1.getLastClaim(child1.address);
    assert(
      lastClaimAfter.eq(lastClaimBefore),
      'Last claim value changed: ' + lastClaimAfter + ' vs ' + lastClaimBefore
    );
  });

  it('Should not change parent param', async function () {
    const parentBefore = await parent1.getParent(child1.address);
    await parent1.changeConfigAndSend(10, 1, child1.address);
    const parentAfter = await parent1.getParent(child1.address);
    assert(parentAfter === parentBefore, 'Parent value changed');
  });

  it('Should change periodicity', async function () {
    const newPeriodicity = 2000;
    const periodicityBefore = await parent1.getPeriodicity(child1.address);
    await parent1.changeConfigAndSend(10, newPeriodicity, child1.address);
    const periodicityAfter = await parent1.getPeriodicity(child1.address);
    assert(
      !periodicityAfter.eq(periodicityBefore),
      'Periodicity value is wrong: ' + periodicityAfter.toString()
    );
  });

  it('Should revert because periodicity is 0', async function () {
    await expect(
      parent1.changeConfigAndSend(10, 0, child1.address)
    ).to.be.revertedWith('!addChild: periodicity cannot be 0');
  });
});
