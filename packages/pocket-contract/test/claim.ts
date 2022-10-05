import { assert, expect } from 'chai';
import * as constants from '../utils/constants';
import { PocketFaucet } from '../typechain-types';
import { getERC20Balance } from '../utils/ERC20';
import setup, { User } from '../utils/testSetup';
import { addFundsPermit, addStdChildAndSend } from '../utils/addChild';
import { time } from '@nomicfoundation/hardhat-network-helpers';

describe('Testing to claim funds as child', function () {
  let parent1: User, child1: User;
  let pocketFaucet: PocketFaucet;
  const tokenAddr = constants.CHOSEN_TOKEN;

  before(async function () {
    const { contracts, parents, children } = await setup();
    child1 = children[0];
    parent1 = parents[0];
    pocketFaucet = contracts.pocketFaucet;

    await addStdChildAndSend(parent1.pocketFaucet, child1.address, tokenAddr);
  });

  it("Should revert because child1's balance is empty", async function () {
    await expect(child1.pocketFaucet.claim()).to.be.revertedWith(
      '!claim: null balance'
    );
  });

  it("Should revert because child1's balance is empty after claim", async function () {
    await parent1.pocketFaucet.withdrawFundsFromChild(0, child1.address);
    await addFundsPermit(
      child1.address,
      '10',
      tokenAddr,
      constants.CHOSEN_WHALE,
      parent1,
      await time.latest()
    );
    const tx = await child1.pocketFaucet.claim();
    await tx.wait();
    await expect(child1.pocketFaucet.claim()).to.be.revertedWith(
      '!claim: null balance'
    );
  });

  it('Should claim the ceiling', async function () {
    const balanceBefore = await getERC20Balance(tokenAddr, child1.address);
    const diffExpected = (await pocketFaucet.childToConfig(child1.address))
      .ceiling;
    await addFundsPermit(
      child1.address,
      '100',
      tokenAddr,
      constants.CHOSEN_WHALE,
      parent1,
      await time.latest()
    );
    await time.increase(8 * constants.TIME.DAY);
    const tx = await child1.pocketFaucet.claim();
    await tx.wait();
    const balanceAfter = await getERC20Balance(tokenAddr, child1.address);
    const diff = balanceAfter.sub(balanceBefore);
    assert(
      diff.eq(diffExpected),
      'The amount of token did not increase properly after claim'
    );
  });

  it('Should claim 5 times the ceiling', async function () {
    const ceiling = (await pocketFaucet.childToConfig(child1.address)).ceiling;
    const diffExpected = ceiling.mul(5);
    await addFundsPermit(
      child1.address,
      '1000',
      tokenAddr,
      constants.CHOSEN_WHALE,
      parent1,
      await time.latest()
    );
    const balanceBefore = await getERC20Balance(tokenAddr, child1.address);
    await time.increase(5 * constants.TIME.WEEK);
    const tx = await child1.pocketFaucet.claim();
    await tx.wait();
    const balanceAfter = await getERC20Balance(tokenAddr, child1.address);
    const diff = balanceAfter.sub(balanceBefore);
    assert(
      diff.eq(diffExpected),
      'The amount of token did not increase properly after claim'
    );
  });

  it('Should claim exactly balance', async function () {
    let tx = await parent1.pocketFaucet.withdrawFundsFromChild(
      0,
      child1.address
    );
    await tx.wait();
    const balanceBefore = await getERC20Balance(tokenAddr, child1.address);
    await addFundsPermit(
      child1.address,
      '30',
      tokenAddr,
      constants.CHOSEN_WHALE,
      parent1,
      await time.latest()
    );
    const diffExpected = (await pocketFaucet.childToConfig(child1.address))
      .balance;
    await time.increase(5 * constants.TIME.WEEK);
    tx = await child1.pocketFaucet.claim();
    await tx.wait();
    const balanceAfter = await getERC20Balance(tokenAddr, child1.address);
    const diff = balanceAfter.sub(balanceBefore);
    assert(
      diff.eq(diffExpected),
      'The amount of token did not increase properly after claim'
    );
  });

  it('Claim after periodicity increase', async function () {
    await parent1.pocketFaucet.withdrawFundsFromChild(0, child1.address);
    const balanceBefore = await getERC20Balance(tokenAddr, child1.address);
    await addFundsPermit(
      child1.address,
      '100',
      tokenAddr,
      constants.CHOSEN_WHALE,
      parent1,
      await time.latest()
    );
    const newPeriodicity = constants.TIME.WEEK * 3;
    await parent1.pocketFaucet.changeConfig(
      child1.address,
      '100',
      newPeriodicity
    );
    await time.increase(5 * constants.TIME.WEEK);
    const diffExpected = await pocketFaucet.computeClaimable(child1.address);
    const tx = await child1.pocketFaucet.claim();
    await tx.wait();
    const balanceAfter = await getERC20Balance(tokenAddr, child1.address);
    const diff = balanceAfter.sub(balanceBefore);
    assert(
      diff.eq(diffExpected),
      'The amount of token did not increase properly after claim'
    );
  });

  it('Claim after periodicity decrease', async function () {
    await parent1.pocketFaucet.withdrawFundsFromChild(0, child1.address);
    const balanceBefore = await getERC20Balance(tokenAddr, child1.address);
    await addFundsPermit(
      child1.address,
      '100',
      tokenAddr,
      constants.CHOSEN_WHALE,
      parent1,
      await time.latest()
    );
    const newPeriodicity = constants.TIME.DAY * 3;
    await parent1.pocketFaucet.changeConfig(
      child1.address,
      '100',
      newPeriodicity
    );
    await time.increase(5 * constants.TIME.WEEK);
    const diffExpected = await pocketFaucet.computeClaimable(child1.address);
    const tx = await child1.pocketFaucet.claim();
    await tx.wait();
    const balanceAfter = await getERC20Balance(tokenAddr, child1.address);
    const diff = balanceAfter.sub(balanceBefore);
    assert(
      diff.eq(diffExpected),
      'The amount of token did not increase properly after claim'
    );
  });

  it('Should revert after active deactivate', async function () {
    await parent1.pocketFaucet.withdrawFundsFromChild(0, child1.address);
    await addFundsPermit(
      child1.address,
      '100',
      tokenAddr,
      constants.CHOSEN_WHALE,
      parent1,
      await time.latest()
    );
    const tx = await parent1.pocketFaucet.setActive(false, child1.address);
    await tx.wait();
    await expect(child1.pocketFaucet.claim()).to.be.revertedWith(
      '!claim: not active'
    );
  });

  it('Claim after periodicity set active', async function () {
    await parent1.pocketFaucet.withdrawFundsFromChild(0, child1.address);
    const balanceBefore = await getERC20Balance(tokenAddr, child1.address);
    await addFundsPermit(
      child1.address,
      '100',
      tokenAddr,
      constants.CHOSEN_WHALE,
      parent1,
      await time.latest()
    );
    let tx = await parent1.pocketFaucet.setActive(false, child1.address);
    await tx.wait();
    tx = await parent1.pocketFaucet.setActive(true, child1.address);
    await tx.wait();
    await time.increase(5 * constants.TIME.WEEK);
    const diffExpected = await pocketFaucet.computeClaimable(child1.address);
    tx = await child1.pocketFaucet.claim();
    await tx.wait();
    const balanceAfter = await getERC20Balance(tokenAddr, child1.address);
    const diff = balanceAfter.sub(balanceBefore);
    assert(
      diff.eq(diffExpected),
      'The amount of token did not increase properly after claim'
    );
  });
});
