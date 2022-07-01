/* eslint-disable no-unused-vars */
import { assert, expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { providers, Wallet } from 'ethers';
import ParentTester from '../helpers/ParentTester';
import * as constants from '../utils/constants';
import { PocketFaucet__factory, PocketFaucet } from '../typechain-types';
import { getERC20Balance } from '../utils/ERC20';

describe('Testing to withdraw funds from child account as parent', function () {
  let child1: Wallet;
  let parent1: ParentTester;
  let parent2: ParentTester;
  let PocketFaucet_factory: PocketFaucet__factory, pocketFaucet: PocketFaucet;
  let provider: providers.JsonRpcProvider;
  let parent1Wallet: Wallet;
  let parent2Wallet: Wallet;
  const tokenAddr = constants.TOKEN_POLY.JEUR;

  before(async function () {
    provider = new providers.JsonRpcProvider('http://localhost:8545');
    child1 = new Wallet(constants.FAMILY_ACCOUNT.child1, provider);

    PocketFaucet_factory = await ethers.getContractFactory('PocketFaucet');
    pocketFaucet = (await upgrades.deployProxy(PocketFaucet_factory, [
      tokenAddr,
    ])) as PocketFaucet;
    await pocketFaucet.deployed();
    parent1Wallet = new Wallet(constants.FAMILY_ACCOUNT.parent1, provider);
    parent2Wallet = new Wallet(constants.FAMILY_ACCOUNT.parent2, provider);
    parent1 = new ParentTester(pocketFaucet.address, parent1Wallet);
    parent2 = new ParentTester(pocketFaucet.address, parent2Wallet);
    await parent1.addStdChildAndSend(child1.address, tokenAddr);
    await parent1.addFundsToChild(
      child1.address,
      '100',
      tokenAddr,
      constants.WHALES_POLY.JEUR
    );
  });

  it('Should withdraw all child fund', async function () {
    const diffExpected = await parent1.getChildBalance(child1.address);
    const tokenBefore = await getERC20Balance(
      tokenAddr,
      parent1Wallet.address,
      provider
    );
    await parent1.contract.withdrawFundsFromChild(0, child1.address);
    const tokenAfter = await getERC20Balance(
      tokenAddr,
      parent1Wallet.address,
      provider
    );
    const diff = tokenAfter.sub(tokenBefore);

    assert(
      diff.eq(diffExpected),
      'The number of token did not increase properly'
    );
  });

  it("Should revert because child2 doesn't belong to parent2", async function () {
    await parent1.addFundsToChild(
      child1.address,
      '100',
      tokenAddr,
      constants.WHALES_POLY.JEUR
    );
    await expect(
      parent2.contract.withdrawFundsFromChild(0, child1.address)
    ).to.be.revertedWith("!_areRelated : child doesn't match");
  });

  it('Should withdraw half of child funds', async function () {
    const childBalance = await parent1.getChildBalance(child1.address);
    const diffExpected = childBalance.div(2);
    const tokenBefore = await getERC20Balance(
      tokenAddr,
      parent1Wallet.address,
      provider
    );
    await parent1.contract.withdrawFundsFromChild(diffExpected, child1.address);
    const tokenAfter = await getERC20Balance(
      tokenAddr,
      parent1Wallet.address,
      provider
    );
    const diff = tokenAfter.sub(tokenBefore);
    assert(
      diff.eq(diffExpected) && !diff.eq(0),
      'The number of token did not increase properly'
    );
  });

  it('Should reverse because trying to withdraw too much funds', async function () {
    const childBalance = await parent1.getChildBalance(child1.address);
    const tryingToSteal = childBalance.mul(2);
    await expect(
      parent1.contract.withdrawFundsFromChild(tryingToSteal, child1.address)
    ).to.be.revertedWith('!withdrawFundsFromChild: amount > childBalance');
  });
});
