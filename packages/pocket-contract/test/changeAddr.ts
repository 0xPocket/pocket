import { assert, expect } from 'chai';
import { ethers } from 'hardhat';
import * as constants from '../utils/constants';
import { PocketFaucet } from '../typechain-types';
import {
  getERC20Balance,
  getDecimals,
  setAllowance,
  setErc20Balance,
} from '../utils/ERC20';
import setup, { User } from '../utils/testSetup';
import { addStdChildAndSend } from '../utils/addChild';
import { checkChildIsInit } from '../utils/getters';
import { time } from '@nomicfoundation/hardhat-network-helpers';

describe('Testing addr changement', function () {
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
  });

  it('Should reverse because child2 is not parent1 child', async function () {
    await expect(
      parent1.pocketFaucet.changeChildAddress(child2.address, child1.address)
    ).to.be.revertedWith("!_areRelated: child doesn't match");
  });

  it('Should change child1 to child2 for parent1', async function () {
    const tx = await parent1.pocketFaucet.changeChildAddress(
      child1.address,
      child2.address
    );
    await tx.wait();
    const child1IsInit = await checkChildIsInit(parent1, child1.address);
    const child2IsInit = await checkChildIsInit(parent1, child2.address);

    assert(
      child1IsInit === false && child2IsInit === true,
      'Child1 should not be set for parent1/Child2 should be set for parent1'
    );
  });

  it('Should test that new child2 can withdraw', async function () {
    const toSend = ethers.utils.parseUnits('10', await getDecimals(tokenAddr));
    const tokenBefore = await getERC20Balance(tokenAddr, child2.address);
    await time.increase(21 * constants.TIME.DAY);
    await setErc20Balance(
      tokenAddr,
      await ethers.getSigner(parent1.address),
      '10',
      constants.CHOSEN_WHALE
    );
    await setAllowance(
      tokenAddr,
      await ethers.getSigner(parent1.address),
      pocketFaucet.address,
      toSend.toString()
    );
    let tx = await parent1.pocketFaucet.addFunds(child2.address, toSend);
    await tx.wait();

    tx = await child2.pocketFaucet.claim({ gasLimit: 3000000 });
    await tx.wait();

    assert(
      tokenBefore.lt(await getERC20Balance(tokenAddr, child2.address)),
      'Child2 number of token did not increased'
    );
  });

  it('Should change parent1 to parent2', async function () {
    const tx = await parent1.pocketFaucet.changeParentAddr(parent2.address);
    await tx.wait();
    const child1IsInit = await checkChildIsInit(parent2, child1.address);
    const child2IsInit = await checkChildIsInit(parent2, child2.address);
    const nbChildParent1 = (
      await pocketFaucet.getNumberChildren(parent1.address)
    ).toNumber();

    assert(
      child1IsInit === false && child2IsInit === true && nbChildParent1 === 0,
      'Child1 should not be set for parent1/Child2 should be set for parent1'
    );
  });

  it('Should revert because trying to change to same address is not possible', async function () {
    await expect(
      parent1.pocketFaucet.changeParentAddr(parent1.address)
    ).to.be.revertedWith('!changeParentAddr : cannot change to same addr');
  });

  // it('Should change parent2 to parent1', async function () {
  //   await parent2.pocketFaucet.changeParentAddr(parent1.address);
  //   await addStdChildAndSend(parent2.pocketFaucet, child1.address, tokenAddr);
  //   const child1IsInit = await checkChildIsInit(parent1, child1.address);
  //   const child2IsInit = await checkChildIsInit(parent1, child2.address);
  //   const child1IsInitP2 = await checkChildIsInit(parent2, child1.address);
  //   const child2IsInitP2 = await checkChildIsInit(parent2, child2.address);
  //   const nbChildParent2 = (
  //     await pocketFaucet.getNumberChildren(parent2.address)
  //   ).toNumber();
  //   const nbChildParent1 = (
  //     await pocketFaucet.getNumberChildren(parent1.address)
  //   ).toNumber();
  //   console.log(child1IsInit, child2IsInit);
  //   console.log(child1IsInitP2, child2IsInitP2);
  //   console.log(nbChildParent1, nbChildParent2);
  //   assert(
  //     child1IsInit === true &&
  //       child2IsInit === true &&
  //       child1IsInitP2 === false &&
  //       child2IsInitP2 === false &&
  //       nbChildParent2 === 0 &&
  //       nbChildParent1 === 2,
  //     'Child1 and Child2 should be set for parent1 and not for P2'
  //   );
  // });

  // it('Should reverse because trying to change to same address is not possible', async function () {
  //   const tx = await parent1.changeParentAddress(parent2.address);
  //   await tx.wait();
  //   const nbChildParent1 = await parent1.getNbChildren();
  //   const nbChildParent2 = await parent2.getNbChildren();
  //   assert(
  //     nbChildParent1 === 0 && nbChildParent2 === 2,
  //     'Parent1 should have 0 children and parent2 2'
  //   );
  //   //  await expect(
  //   //    parent2.changeParentAddress(parent2.address)
  //   //  ).to.revert();
  // });
});
