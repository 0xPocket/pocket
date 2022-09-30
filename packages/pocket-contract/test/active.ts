/* eslint-disable no-unused-vars */
import { assert, expect } from 'chai';
import { ethers } from 'hardhat';
import { Wallet } from 'ethers';
import ParentTester from '../ts/ParentTester';
import * as constants from '../utils/constants';
import setup, { User } from '../utils/testSetup';
import addStdChildAndSend from '../utils/addChild';
import { PocketFaucet } from '../typechain-types';

describe('Testing active param change', function () {
  let parent1: User, parent2: User;
  let child1: User, child2: User;
  let pocketFaucet: PocketFaucet;
  const tokenAddr = constants.CHOSEN_TOKEN;

  before(async function () {
    const { contracts, parents, children, randomUsers } = await setup();
    child1 = children[0];
    child2 = children[1];
    parent1 = parents[1];
    parent2 = parents[1];
    pocketFaucet = contracts.pocketFaucet;

    await addStdChildAndSend(parent1.pocketFaucet, child1.address, tokenAddr);
    await addStdChildAndSend(parent2.pocketFaucet, child2.address, tokenAddr);
  });

  it('Should change child1 active variable value', async function () {
    const [activeBefore, , , , ,] = await parent1.pocketFaucet.childToConfig(
      child1.address
    );
    const tx = await parent1.pocketFaucet.setActive(false, child1.address);
    await tx.wait();
    const [activeAfter, , , , ,] = await pocketFaucet.childToConfig(
      child1.address
    );
    assert(activeAfter != activeBefore, 'Active value did not change');
  });

  // it('Should revert because not related', async function () {
  //   await expect(parent1.setActive(false, child2)).to.be.revertedWith(
  //     "!_areRelated: child doesn't match"
  //   );
  // });

  // it('Should change child2 active variable value 2 times', async function () {
  //   const activeBefore = await parent2.getActive(child2);
  //   let tx = await parent2.setActive(false, child2);
  //   await tx.wait();
  //   const activeAfter = await parent2.getActive(child2);
  //   assert(activeAfter !== activeBefore, 'Active value did not change');
  //   tx = await parent2.setActive(true, child2);
  //   await tx.wait();
  //   const activeBack = await parent2.getActive(child2);
  //   assert(
  //     activeBack === activeBefore,
  //     'Active value did not go back to original value'
  //   );
  // });
});
