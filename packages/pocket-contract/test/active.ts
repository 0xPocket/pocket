import { assert, expect } from 'chai';
import * as constants from '../utils/constants';
import setup, { User } from '../utils/testSetup';
import { addStdChildAndSend } from '../utils/addChild';
import { PocketFaucet } from '../typechain-types';

describe('Testing active param change', function () {
  let parent1: User, parent2: User;
  let child1: User, child2: User;
  let pocketFaucet: PocketFaucet;
  const tokenAddr = constants.CHOSEN_TOKEN;

  before(async function () {
    const { contracts, parents, children } = await setup();
    child1 = children[0];
    child2 = children[1];
    parent1 = parents[0];
    parent2 = parents[1];
    pocketFaucet = contracts.pocketFaucet;

    await addStdChildAndSend(parent1.pocketFaucet, child1.address, tokenAddr);
    await addStdChildAndSend(parent2.pocketFaucet, child2.address, tokenAddr);
  });

  it('Should change child1 active variable value', async function () {
    const activeBefore = (await pocketFaucet.childToConfig(child1.address))
      .active;
    const tx = await parent1.pocketFaucet.setActive(false, child1.address);
    await tx.wait();
    const activeAfter = (await pocketFaucet.childToConfig(child1.address))
      .active;

    assert(activeAfter != activeBefore, 'Active value did not change');
  });

  it('Should revert because not related', async function () {
    await expect(
      parent2.pocketFaucet.setActive(false, child1.address)
    ).to.be.revertedWith("!_areRelated: child doesn't match");
  });

  it('Should change child2 active variable value 2 times', async function () {
    const activeBefore = (await pocketFaucet.childToConfig(child2.address))
      .active;
    let tx = await parent2.pocketFaucet.setActive(false, child2.address);
    await tx.wait();
    const activeAfter = (await pocketFaucet.childToConfig(child2.address))
      .active;
    assert(activeAfter !== activeBefore, 'Active value did not change');

    tx = await parent2.pocketFaucet.setActive(true, child2.address);
    await tx.wait();
    const activeBack = (await pocketFaucet.childToConfig(child2.address))
      .active;
    assert(
      activeBack === activeBefore,
      'Active value did not go back to original value'
    );
  });
});
