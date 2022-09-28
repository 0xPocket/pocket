/* eslint-disable no-unused-vars */
import { assert, expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { Wallet } from 'ethers';
import ParentTester from '../ts/ParentTester';
import * as constants from '../utils/constants';
import { PocketFaucet__factory, PocketFaucet } from '../typechain-types';
import config from 'config/network';

describe('Testing active param change', function () {
  let child1: Wallet, child2: Wallet;
  let parent1: ParentTester, parent2: ParentTester;
  let PocketFaucet_factory: PocketFaucet__factory, pocketFaucet: PocketFaucet;
  const tokenAddr = constants.CHOSEN_TOKEN;

  before(async function () {
    child1 = new Wallet(constants.FAMILY_ACCOUNT.child1, ethers.provider);
    child2 = new Wallet(constants.FAMILY_ACCOUNT.child2, ethers.provider);

    PocketFaucet_factory = await ethers.getContractFactory('PocketFaucet');
    pocketFaucet = (await upgrades.deployProxy(PocketFaucet_factory, [
      tokenAddr,
      config.localhost.TRUSTED_FORWARDER,
    ])) as PocketFaucet;
    pocketFaucet.deployed();
    await pocketFaucet.deployed();
    parent1 = new ParentTester(
      pocketFaucet.address,
      new Wallet(constants.FAMILY_ACCOUNT.parent1, ethers.provider)
    );
    parent2 = new ParentTester(
      pocketFaucet.address,
      new Wallet(constants.FAMILY_ACCOUNT.parent2, ethers.provider)
    );
    await parent1.addStdChildAndSend(child1.address, tokenAddr);
    await parent2.addStdChildAndSend(child2.address, tokenAddr);
  });

  it('Should change child1 active variable value', async function () {
    const activeBefore = await parent1.getActive(child1.address);
    const tx = await parent1.setActive(false, child1.address);
    await tx.wait();
    const activeAfter = await parent1.getActive(child1.address);
    assert(activeAfter != activeBefore, 'Active value did not change');
  });

  it('Should revert because not related', async function () {
    await expect(parent1.setActive(false, child2.address)).to.be.revertedWith(
      "!_areRelated: child doesn't match"
    );
  });

  it('Should change child2 active variable value 2 times', async function () {
    const activeBefore = await parent2.getActive(child2.address);
    let tx = await parent2.setActive(false, child2.address);
    await tx.wait();
    const activeAfter = await parent2.getActive(child2.address);
    assert(activeAfter !== activeBefore, 'Active value did not change');
    tx = await parent2.setActive(true, child2.address);
    await tx.wait();
    const activeBack = await parent2.getActive(child2.address);
    assert(
      activeBack === activeBefore,
      'Active value did not go back to original value'
    );
  });
});
