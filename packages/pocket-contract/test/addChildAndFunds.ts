/* eslint-disable no-unused-vars */
import { assert, expect } from 'chai';
import { ethers } from 'hardhat';
import * as constants from '../utils/constants';
import { stringToDecimalsVersion } from '../utils/ERC20';
import setup, { User } from '../utils/testSetup';
import { PocketFaucet } from '../typechain-types';
import {
  addStdChildAndSend,
  addChildAndFundsPermitAndSend,
} from '../utils/addChild';

describe('Testing add Child and funds', function () {
  let parent1: User;
  let child1: User, child2: User, child3: User;
  let pocketFaucet: PocketFaucet;
  const tokenAddr = constants.CHOSEN_TOKEN;
  const whale = constants.CHOSEN_WHALE;

  before(async function () {
    const { contracts, parents, children } = await setup();
    child1 = children[0];
    child2 = children[1];
    child3 = children[2];
    parent1 = parents[0];
    pocketFaucet = contracts.pocketFaucet;
  });

  it('Should revert because new child addr is zero', async function () {
    await expect(
      addChildAndFundsPermitAndSend(
        1,
        1,
        ethers.constants.AddressZero,
        0,
        tokenAddr,
        whale,
        parent1
      )
    ).to.be.revertedWith('!addChild: Address is null');
  });

  it('Should revert because child is already set', async function () {
    await addStdChildAndSend(parent1.pocketFaucet, child1.address, tokenAddr);

    await expect(
      addChildAndFundsPermitAndSend(
        1,
        1,
        child1.address,
        0,
        tokenAddr,
        whale,
        parent1
      )
    ).to.be.revertedWith('!addChild: Child address already taken');
  });

  it('Should add 1 child and give him 0', async function () {
    await addChildAndFundsPermitAndSend(
      1,
      1,
      child2.address,
      0,
      tokenAddr,
      whale,
      parent1
    );
    assert(
      (await pocketFaucet.getNumberChildren(parent1.address)).toNumber() === 2,
      'Number of children is not good'
    );
    assert(
      (await pocketFaucet.childToConfig(child2.address)).balance.isZero(),
      'This child has not got the right balance'
    );
  });

  it('Should revert because addFunds did not work', async function () {
    await expect(
      addChildAndFundsPermitAndSend(
        1,
        1,
        child3.address,
        5,
        tokenAddr,
        null,
        parent1
      )
    ).to.be.revertedWith(constants.CHOSEN_ERRORMSG);
  });

  it('Should add 1 child and give him money', async function () {
    await addChildAndFundsPermitAndSend(
      1,
      1,
      child3.address,
      15,
      tokenAddr,
      whale,
      parent1
    );
    assert(
      (await pocketFaucet.getNumberChildren(parent1.address)).toNumber() === 3,
      'Number of children is not good'
    );
    assert(
      (await pocketFaucet.childToConfig(child3.address)).balance.eq(
        await stringToDecimalsVersion(tokenAddr, '15')
      ),
      'This child has not got the right balance'
    );
    assert(
      (await pocketFaucet.childToConfig(child2.address)).balance.eq(
        await stringToDecimalsVersion(tokenAddr, '0')
      ),
      'This child has not got the right balance'
    );
  });
});
