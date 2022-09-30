/* eslint-disable no-unused-vars */
import { assert, expect } from 'chai';
import { ethers } from 'hardhat';
import { Wallet } from 'ethers';
import ParentTester from '../ts/ParentTester';
import * as constants from '../utils/constants';
import { stringToDecimalsVersion } from '../utils/ERC20';
import setup from '../utils/testSetup';

describe('Testing add Child and funds', function () {
  let parent1: ParentTester;
  let child1: string, child2: string, child3: string;
  const parent1Wallet = new Wallet(
    constants.FAMILY_ACCOUNT.parent1,
    ethers.provider
  );
  const tokenAddr = constants.CHOSEN_TOKEN;
  const whale = constants.CHOSEN_WHALE;
  const tokenIndex = 0;

  before(async function () {
    const { pocketFaucet, namedAccounts } = await setup();
    child1 = namedAccounts['child1'];
    child2 = namedAccounts['child2'];
    child3 = namedAccounts['child3'];
    parent1 = new ParentTester(pocketFaucet.address, parent1Wallet);
  });

  it('Should revert because new child addr is zero', async function () {
    await expect(
      parent1.addChildAndFundsPermitAndSend(
        1,
        1,
        ethers.constants.AddressZero,
        0,
        tokenAddr,
        tokenIndex,
        whale
      )
    ).to.be.revertedWith('!addChild: Address is null');
  });

  it('Should revert because child is already set', async function () {
    await parent1.addStdChildAndSend(child1, tokenAddr);
    await expect(
      parent1.addChildAndFundsPermitAndSend(
        1,
        1,
        child1,
        0,
        tokenAddr,
        tokenIndex,
        whale
      )
    ).to.be.revertedWith('!addChild: Child address already taken');
  });

  it('Should add 1 child and give him 0', async function () {
    await parent1.addChildAndFundsPermitAndSend(
      1,
      1,
      child2,
      0,
      tokenAddr,
      tokenIndex,
      whale
    );
    assert(
      (await parent1.getNbChildren()) === 2,
      'Number of children is not good'
    );
    assert(
      (await parent1.getChildBalance(child2)).isZero(),
      'This child has not got the right balance'
    );
  });

  it('Should revert because addFunds did not work', async function () {
    await expect(
      parent1.addChildAndFundsPermitAndSend(
        1,
        1,
        child3,
        5,
        tokenAddr,
        tokenIndex,
        null
      )
    ).to.be.revertedWith(constants.CHOSEN_ERRORMSG);
  });

  it('Should add 1 child and give him money', async function () {
    await parent1.addChildAndFundsPermitAndSend(
      1,
      1,
      child3,
      15,
      tokenAddr,
      tokenIndex,
      whale
    );
    assert(
      (await parent1.getNbChildren()) === 3,
      'Number of children is not good'
    );
    assert(
      (await parent1.getChildBalance(child3)).eq(
        await stringToDecimalsVersion(tokenAddr, '15')
      ),
      'This child has not got the right balance'
    );
    assert(
      (await parent1.getChildBalance(child2)).eq(
        await stringToDecimalsVersion(tokenAddr, '0')
      ),
      'This child has not got the right balance'
    );
  });
});
