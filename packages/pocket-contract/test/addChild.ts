import { assert, expect } from 'chai';
import { ethers } from 'hardhat';
import * as constants from '../utils/constants';
import { PocketFaucet } from '../typechain-types';
import { addStdChildAndSend } from '../utils/addChild';
import setup, { User } from '../utils/testSetup';

describe('Testing add Child', function () {
  let parent1: User, child1: User;
  let pocketFaucet: PocketFaucet;
  const tokenAddr = constants.CHOSEN_TOKEN;

  before(async function () {
    const { contracts, parents, children } = await setup();
    child1 = children[0];
    parent1 = parents[0];
    pocketFaucet = contracts.pocketFaucet;
  });

  it('Should revert because new child addr is zero', async function () {
    await expect(
      parent1.pocketFaucet.changeConfig(ethers.constants.AddressZero, 0, 0)
    ).to.be.revertedWith('!_areRelated: null child address');
  });

  it('Should revert because child already added', async function () {
    await addStdChildAndSend(parent1.pocketFaucet, child1.address, tokenAddr);

    await expect(
      addStdChildAndSend(parent1.pocketFaucet, child1.address, tokenAddr)
    ).to.be.revertedWith('Child address already taken');
  });

  it('Should add 20 children', async function () {
    for (let i = 0; i < 20; i++) {
      await addStdChildAndSend(
        parent1.pocketFaucet,
        constants.RDM_ADDRESS[i],
        tokenAddr
      );
    }
    assert(
      (await pocketFaucet.getNumberChildren(parent1.address)).toNumber() === 21,
      'Number of children is not good'
    );
  });
});
