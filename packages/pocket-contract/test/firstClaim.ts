import { expect } from 'chai';
import * as constants from '../utils/constants';
import { PocketFaucet } from '../typechain-types';
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

  it('Should correctly initialize lastClaim', async function () {
    expect(
      (await pocketFaucet.childToConfig(child1.address)).lastClaim
    ).to.be.equal(0);
  });

  it('Should correctly define lastClaim after the first claim', async function () {
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
    expect(
      (await pocketFaucet.childToConfig(child1.address)).lastClaim
    ).to.be.equal(await time.latest());
  });
});
