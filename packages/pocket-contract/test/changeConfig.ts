/* eslint-disable no-unused-vars */
import { assert, expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { Wallet } from 'ethers';
import ParentTester from '../ts/ParentTester';
import * as constants from '../utils/constants';
import { PocketFaucet__factory, PocketFaucet } from '../typechain-types';
import config from 'config/network';
import setup, { User } from '../utils/testSetup';
import { addStdChildAndSend } from '../utils/addChild';
import {
  getCeiling,
  getLastClaim,
  getParent,
  getPeriodicity,
} from '../utils/getters';

describe('Testing conf changement', function () {
  let parent1: User;
  let child1: User, child2: User;
  let pocketFaucet: PocketFaucet;
  const tokenAddr = constants.CHOSEN_TOKEN;

  before(async function () {
    const { contracts, parents, children } = await setup();
    child1 = children[0];
    child2 = children[1];
    parent1 = parents[0];
    pocketFaucet = contracts.pocketFaucet;

    await addStdChildAndSend(parent1.pocketFaucet, child1.address, tokenAddr);
  });

  it('Should revert because new child addr is zero', async function () {
    await expect(
      parent1.pocketFaucet.changeConfig(ethers.constants.AddressZero, 0, 0)
    ).to.be.revertedWith('!_areRelated: null child address');
  });

  it('Should revert because child2 is not set for this parent', async function () {
    await expect(
      parent1.pocketFaucet.changeConfig(child2.address, 0, 0)
    ).to.be.revertedWith("!_areRelated: child doesn't match");
  });

  it('Should revert because child1 is not set anymore', async function () {
    await parent1.pocketFaucet.removeChild(child1.address);
    await expect(
      parent1.pocketFaucet.changeConfig(child1.address, 0, 0)
    ).to.be.revertedWith("!_areRelated: child doesn't match");
  });

  it('Should change ceiling', async function () {
    await addStdChildAndSend(parent1.pocketFaucet, child1.address, tokenAddr);
    const ceilingBefore = await getCeiling(child1.address, pocketFaucet);
    await parent1.pocketFaucet.changeConfig(child1.address, 10, 1);
    const ceilingAfter = await getCeiling(child1.address, pocketFaucet);
    assert(!ceilingAfter.eq(ceilingBefore), 'Ceiling value did not change');
  });

  it('Should not change lastClaim', async function () {
    const lastClaimBefore = await getLastClaim(child1.address, pocketFaucet);
    await parent1.pocketFaucet.changeConfig(child1.address, 20, 1);
    const lastClaimAfter = await getLastClaim(child1.address, pocketFaucet);
    assert(
      lastClaimAfter.eq(lastClaimBefore),
      'Last claim value changed: ' + lastClaimAfter + ' vs ' + lastClaimBefore
    );
  });

  it('Should not change parent param', async function () {
    const parentBefore = await getParent(child1.address, pocketFaucet);
    await parent1.pocketFaucet.changeConfig(child1.address, 10, 1);
    const parentAfter = await getParent(child1.address, pocketFaucet);
    assert(parentAfter === parentBefore, 'Parent value changed');
  });

  it('Should change periodicity', async function () {
    const newPeriodicity = 2000;
    const periodicityBefore = await getPeriodicity(
      child1.address,
      pocketFaucet
    );
    await parent1.pocketFaucet.changeConfig(child1.address, 10, newPeriodicity);
    const periodicityAfter = await getPeriodicity(child1.address, pocketFaucet);
    assert(
      !periodicityAfter.eq(periodicityBefore),
      'Periodicity value is wrong: ' + periodicityAfter.toString()
    );
  });

  it('Should revert because periodicity is 0', async function () {
    await expect(
      parent1.pocketFaucet.changeConfig(child1.address, 10, 0)
    ).to.be.revertedWith('!changeConfig: periodicity cannot be 0');
  });
});
