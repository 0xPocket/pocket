/* eslint-disable no-unused-vars */
import { assert, expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { providers, Wallet } from 'ethers';
import ParentTester from '../helpers/ParentTester';
import * as constants from '../utils/constants';
import { PocketFaucet__factory, PocketFaucet } from '../typechain-types';
import { getERC20Balance } from '../utils/ERC20';
import { ChildContract } from '../ts/Child';
import goForwardNDays from '../utils/goForward';

describe('Testing to claim funds as child', function () {
  let child1Wallet: Wallet, child2Wallet: Wallet;
  let child1: ChildContract;
  let parent1: ParentTester;
  let PocketFaucet_factory: PocketFaucet__factory, pocketFaucet: PocketFaucet;
  let provider: providers.JsonRpcProvider;
  let parent1Wallet: Wallet;
  const tokenAddr = constants.TOKEN_POLY.JEUR;
  const URL = constants.RPC_URL.LOCAL;

  before(async function () {
    provider = new providers.JsonRpcProvider(URL);
    PocketFaucet_factory = await ethers.getContractFactory('PocketFaucet');
    pocketFaucet = (await upgrades.deployProxy(PocketFaucet_factory, [
      tokenAddr,
    ])) as PocketFaucet;
    await pocketFaucet.deployed();
    child1Wallet = new Wallet(constants.FAMILY_ACCOUNT.child1, provider);
    child2Wallet = new Wallet(constants.FAMILY_ACCOUNT.child2, provider);
    child1 = new ChildContract(pocketFaucet.address, child1Wallet);
    parent1Wallet = new Wallet(constants.FAMILY_ACCOUNT.parent1, provider);
    parent1 = new ParentTester(pocketFaucet.address, parent1Wallet);
    await parent1.addStdChildAndSend(child1Wallet.address, tokenAddr);
  });

  it("Should revert because child1's balance is empty", async function () {
    await expect(child1.claim()).to.be.revertedWith('!claim: null balance');
  });

  it("Should revert because child1's balance is empty", async function () {
    await parent1.contract.withdrawFundsFromChild(0, child1.address);
    await parent1.addFundsToChild(
      child1.address,
      '10',
      tokenAddr,
      constants.WHALES_POLY.JEUR
    );
    await child1.claim();
    await expect(child1.claim()).to.be.revertedWith('!claim: null balance');
  });

  it('Should claim the ceiling', async function () {
    const balanceBefore = await getERC20Balance(
      tokenAddr,
      child1.address,
      provider
    );
    const diffExpected = await parent1.getChildCeiling(child1Wallet.address);
    await parent1.addFundsToChild(
      child1.address,
      '100',
      tokenAddr,
      constants.WHALES_POLY.JEUR
    );
    await goForwardNDays(URL, 8);
    await child1.claim();
    const balanceAfter = await getERC20Balance(
      tokenAddr,
      child1.address,
      provider
    );
    const diff = balanceAfter.sub(balanceBefore);
    assert(
      diff.eq(diffExpected),
      'The amount of token did not increase properly after claim'
    );
  });

  it('Should claim 5 times the ceiling', async function () {
    const balanceBefore = await getERC20Balance(
      tokenAddr,
      child1.address,
      provider
    );
    const ceiling = await parent1.getChildCeiling(child1Wallet.address);
    const diffExpected = ceiling.mul(5);
    await parent1.addFundsToChild(
      child1.address,
      '1000',
      tokenAddr,
      constants.WHALES_POLY.JEUR
    );
    await goForwardNDays(URL, 7 * 5 + 1);
    await child1.claim();
    const balanceAfter = await getERC20Balance(
      tokenAddr,
      child1.address,
      provider
    );
    const diff = balanceAfter.sub(balanceBefore);

    assert(
      diff.eq(diffExpected),
      'The amount of token did not increase properly after claim'
    );
  });

  it('Should claim exactly balance', async function () {
    await parent1.contract.withdrawFundsFromChild(0, child1.address);
    const balanceBefore = await getERC20Balance(
      tokenAddr,
      child1.address,
      provider
    );
    await parent1.addFundsToChild(
      child1.address,
      '30',
      tokenAddr,
      constants.WHALES_POLY.JEUR
    );
    const diffExpected = await parent1.getChildBalance(child1Wallet.address);
    await goForwardNDays(URL, 7 * 5);
    await child1.claim();
    const balanceAfter = await getERC20Balance(
      tokenAddr,
      child1.address,
      provider
    );
    const diff = balanceAfter.sub(balanceBefore);
    assert(
      diff.eq(diffExpected),
      'The amount of token did not increase properly after claim'
    );
  });

  it('Claim after periodicity increase', async function () {
    await parent1.contract.withdrawFundsFromChild(0, child1.address);
    const balanceBefore = await getERC20Balance(
      tokenAddr,
      child1.address,
      provider
    );
    await parent1.addFundsToChild(
      child1.address,
      '100',
      tokenAddr,
      constants.WHALES_POLY.JEUR
    );
    const newPeriodicity = constants.TIME.WEEK * 3;
    await parent1.changeConfig('100', newPeriodicity, child1.address);
    await goForwardNDays(URL, 7 * 5);
    const diffExpected = await parent1.calculateClaimable(child1.address);
    await child1.claim();
    const balanceAfter = await getERC20Balance(
      tokenAddr,
      child1.address,
      provider
    );
    const diff = balanceAfter.sub(balanceBefore);
    assert(
      diff.eq(diffExpected),
      'The amount of token did not increase properly after claim'
    );
  });

  it('Claim after periodicity decrease', async function () {
    await parent1.contract.withdrawFundsFromChild(0, child1.address);
    const balanceBefore = await getERC20Balance(
      tokenAddr,
      child1.address,
      provider
    );
    await parent1.addFundsToChild(
      child1.address,
      '100',
      tokenAddr,
      constants.WHALES_POLY.JEUR
    );
    const newPeriodicity = constants.TIME.DAY * 3;
    await parent1.changeConfig('100', newPeriodicity, child1.address);
    await goForwardNDays(URL, 7 * 5);
    const diffExpected = await parent1.calculateClaimable(child1.address);
    await child1.claim();
    const balanceAfter = await getERC20Balance(
      tokenAddr,
      child1.address,
      provider
    );
    const diff = balanceAfter.sub(balanceBefore);
    assert(
      diff.eq(diffExpected),
      'The amount of token did not increase properly after claim'
    );
  });

  it('Should revert after active deactivate', async function () {
    await parent1.contract.withdrawFundsFromChild(0, child1.address);
    await parent1.addFundsToChild(
      child1.address,
      '100',
      tokenAddr,
      constants.WHALES_POLY.JEUR
    );
    await parent1.setActive(false, child1.address);
    await expect(child1.claim()).to.be.revertedWith('!claim: not active');
  });

  it('Claim after periodicity set active', async function () {
    await parent1.contract.withdrawFundsFromChild(0, child1.address);
    const balanceBefore = await getERC20Balance(
      tokenAddr,
      child1.address,
      provider
    );
    await parent1.addFundsToChild(
      child1.address,
      '100',
      tokenAddr,
      constants.WHALES_POLY.JEUR
    );
    await parent1.setActive(false, child1.address);
    await parent1.setActive(true, child1.address);
    await goForwardNDays(URL, 7 * 5);
    const diffExpected = await parent1.calculateClaimable(child1.address);
    await child1.claim();
    const balanceAfter = await getERC20Balance(
      tokenAddr,
      child1.address,
      provider
    );
    const diff = balanceAfter.sub(balanceBefore);
    assert(
      diff.eq(diffExpected),
      'The amount of token did not increase properly after claim'
    );
  });
});
