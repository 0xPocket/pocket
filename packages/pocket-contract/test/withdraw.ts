import { expect } from 'chai';
import * as constants from '../utils/constants';
import { PocketFaucet } from '../typechain-types';
import setup, { User } from '../utils/testSetup';
import { addStdChildAndSend } from '../utils/addChild';

describe('Testing withdraw', function () {
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

  it('Should revert because there are no coin', async function () {
    await expect(pocketFaucet.withdrawCoin('1000000')).to.reverted;
  });

  // TO DO : REFACTOR
  //   it('should withdraw 10 ether', async function () {
  //     let tx = await parent1. .sendTransaction({
  //       to: pocketFaucet.address,
  //       value: ethers.utils.parseEther('10'),
  //     });
  //     await tx.wait();
  //     const balanceBefore = await ethers.provider.getBalance(parent1. .address);
  //     tx = await pocketFaucet.withdrawCoin(
  //       ethers.utils.parseEther('10').toString()
  //     );
  //     await tx.wait();
  //     const balanceAfter = await ethers.provider.getBalance(parent1. .address);
  //     assert(balanceAfter.gt(balanceBefore), 'Amount of token did not increase');
  //   });
});
