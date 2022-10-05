import { assert, expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { Wallet } from 'ethers';
import * as constants from '../utils/constants';
import { PocketFaucet__factory, PocketFaucet } from '../typechain-types';
import config from 'config/network';
import { getERC20Balance } from '../utils/ERC20';
import setup, { User } from '../utils/testSetup';
import { addFundsPermit, addStdChildAndSend } from '../utils/addChild';
import { time } from '@nomicfoundation/hardhat-network-helpers';

describe('Testing to withdraw funds from child account as parent', function () {
  let parent1: User, parent2: User;
  let child1: User, child2: User;
  let pocketFaucet: PocketFaucet;
  const tokenAddr = constants.CHOSEN_TOKEN;
  const whale = constants.CHOSEN_WHALE;

  before(async function () {
    const { contracts, parents, children } = await setup();
    child1 = children[0];
    child2 = children[1];
    parent1 = parents[0];
    parent2 = parents[1];
    pocketFaucet = contracts.pocketFaucet;

    await addStdChildAndSend(parent1.pocketFaucet, child1.address, tokenAddr);
    await addFundsPermit(
      child1.address,
      '100',
      tokenAddr,
      whale,
      parent1,
      await time.latest()
    );
  });

  it('Should withdraw all child fund', async function () {
    const diffExpected = (await pocketFaucet.childToConfig(child1.address))
      .balance;
    const tokenBefore = await getERC20Balance(tokenAddr, parent1.address);
    const tx = await parent1.pocketFaucet.withdrawFundsFromChild(
      0,
      child1.address
    );
    await tx.wait();
    const tokenAfter = await getERC20Balance(tokenAddr, parent1.address);
    const diff = tokenAfter.sub(tokenBefore);

    assert(
      diff.eq(diffExpected),
      'The number of token did not increase properly'
    );
  });

  it("Should revert because child2 doesn't belong to parent2", async function () {
    await addFundsPermit(
      child1.address,
      '100',
      tokenAddr,
      constants.CHOSEN_WHALE,
      parent1,
      await time.latest()
    );
    await expect(
      parent2.pocketFaucet.withdrawFundsFromChild(0, child1.address)
    ).to.be.revertedWith("!_areRelated: child doesn't match");
  });

  it('Should withdraw half of child funds', async function () {
    const childBalance = (await pocketFaucet.childToConfig(child1.address))
      .balance;
    const diffExpected = childBalance.div(2);
    const tokenBefore = await getERC20Balance(tokenAddr, parent1.address);
    const tx = await parent1.pocketFaucet.withdrawFundsFromChild(
      diffExpected,
      child1.address
    );
    await tx.wait();
    const tokenAfter = await getERC20Balance(tokenAddr, parent1.address);
    const diff = tokenAfter.sub(tokenBefore);
    assert(
      diff.eq(diffExpected) && !diff.eq(0),
      'The number of token did not increase properly'
    );
  });

  it('Should reverse because trying to withdraw too much funds', async function () {
    const childBalance = (await pocketFaucet.childToConfig(child1.address))
      .balance;
    const tryingToSteal = childBalance.mul(2);
    await expect(
      parent1.pocketFaucet.withdrawFundsFromChild(tryingToSteal, child1.address)
    ).to.be.revertedWith('!withdrawFundsFromChild: amount > childBalance');
  });
});
