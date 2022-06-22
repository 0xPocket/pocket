/* eslint-disable no-unused-vars */
import { assert, expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { providers, Wallet } from 'ethers';
import ParentTester from '../helpers/ParentTester';
import * as constants from "../utils/constants";
import { PocketFaucet__factory, PocketFaucet } from "../typechain-types";
import { getERC20Balance } from '../utils/ERC20';
import { ChildContract } from '../ts/Child';
import goForwardNDays from '../utils/goForward';

describe('Testing to claim funds from child', function () {
  let child1Wallet: Wallet, child2Wallet: Wallet;
  let child1: ChildContract;
  let child2: ChildContract;
  let parent1: ParentTester;
  let parent2: ParentTester;
  let PocketFaucet_factory: PocketFaucet__factory, pocketFaucet: PocketFaucet;
  let provider : providers.JsonRpcProvider;
  let parent1Wallet: Wallet;
  let parent2Wallet: Wallet;
  const tokenAddr = constants.TOKEN_POLY.JEUR;
  const URL = constants.RPC_URL.LOCAL;
  
  before(async function () {
    provider = new providers.JsonRpcProvider(URL);
    PocketFaucet_factory = await ethers.getContractFactory('PocketFaucet');
    pocketFaucet = await upgrades.deployProxy(PocketFaucet_factory, [tokenAddr]) as PocketFaucet;
    await pocketFaucet.deployed();
    child1Wallet = new Wallet(constants.FAMILY_ACCOUNT.child1, provider);
    child2Wallet = new Wallet(constants.FAMILY_ACCOUNT.child2, provider);
    child1 = new ChildContract(pocketFaucet.address, child1Wallet);
    child2 = new ChildContract(pocketFaucet.address, child2Wallet);
    parent1Wallet = new Wallet(constants.FAMILY_ACCOUNT.parent1, provider);
    parent2Wallet = new Wallet(constants.FAMILY_ACCOUNT.parent2, provider);
    parent1 = new ParentTester(pocketFaucet.address, parent1Wallet);
    parent2 = new ParentTester(pocketFaucet.address, parent2Wallet);
    await parent1.addStdChildAndSend(child1Wallet.address, tokenAddr);
  });

  // it('Should withdraw all child fund', async function () {
  //   const diffExpected = await parent1.getChildBalance(child1Wallet.address);
  //   const tokenBefore = await getBalance(tokenAddr, parent1Wallet.address, provider);
  //   await parent1.contract.withdrawFundsFromChild(0, child1Wallet.address);
  //   const tokenAfter = await getBalance(tokenAddr, parent1Wallet.address, provider);
  //   const diff = tokenAfter.sub(tokenBefore);
  //   assert(diff.eq(diffExpected) , "The number of token did not increase properly");
  // });


  it('Should revert because child1\'s balance is empty', async function () {
    // await parent1.addFundsToChild(child1.address, "100", tokenAddr, constants.WHALES_POLY.JEUR);
    await expect(
      child1.claim()
    ).to.be.revertedWith("!claim: null balance"); 
  });

  it('Should revert because child1\'s balance is empty', async function () {
    // await parent1.addFundsToChild(child1.address, "100", tokenAddr, constants.WHALES_POLY.JEUR);
    await parent1.contract.withdrawFundsFromChild(0, child1.address);
    await parent1.addFundsToChild(child1.address, "10", tokenAddr, constants.WHALES_POLY.JEUR);
    await  child1.claim();
    await expect(
      child1.claim()
    ).to.be.revertedWith("!claim: null balance"); 
  });

  it('Should claim the ceiling', async function () {
    // await parent1.addFundsToChild(child1.address, "100", tokenAddr, constants.WHALES_POLY.JEUR);
    const balanceBefore = await getERC20Balance(tokenAddr, child1.address, provider);

    const diffExpected = await parent1.getChildCeiling(child1Wallet.address);
    await parent1.addFundsToChild(child1.address, "100", tokenAddr, constants.WHALES_POLY.JEUR);
    await goForwardNDays(URL, 8);
    await child1.claim();
    const balanceAfter = await getERC20Balance(tokenAddr, child1.address, provider);
    const diff = balanceAfter.sub(balanceBefore);
    assert(diff.eq(diffExpected), "The amount of token did not increase properly after claim") 
  });

  it('Should claim a 5 times the ceiling', async function () {
    // await parent1.addFundsToChild(child1.address, "100", tokenAddr, constants.WHALES_POLY.JEUR);
    const balanceBefore = await getERC20Balance(tokenAddr, child1.address, provider);
    const ceiling = await parent1.getChildCeiling(child1Wallet.address);
    const diffExpected = ceiling.mul(5);
    await parent1.addFundsToChild(child1.address, "1000", tokenAddr, constants.WHALES_POLY.JEUR);
    await goForwardNDays(URL, 7 * 5 + 1);
    await child1.claim();
    const balanceAfter = await getERC20Balance(tokenAddr, child1.address, provider);
    const diff = balanceAfter.sub(balanceBefore);
    assert(diff.eq(diffExpected), "The amount of token did not increase properly after claim") 
  });


  it('Should claim a balance', async function () {
    await parent1.contract.withdrawFundsFromChild(0, child1.address);
    const balanceBefore = await getERC20Balance(tokenAddr, child1.address, provider);
    // const ceiling = await parent1.getChildCeiling(child1Wallet.address);
    await parent1.addFundsToChild(child1.address, "30", tokenAddr, constants.WHALES_POLY.JEUR);
    const diffExpected = await parent1.getChildBalance(child1Wallet.address);
    await goForwardNDays(URL, 7 * 5);
    await child1.claim();
    const balanceAfter = await getERC20Balance(tokenAddr, child1.address, provider);
    const diff = balanceAfter.sub(balanceBefore);
    assert(diff.eq(diffExpected), "The amount of token did not increase properly after claim") 
  });
  // it('Should withdraw half of child funds', async function () {
  //   const childBalance = await parent1.getChildBalance(child1.address);
  //   const diffExpected = childBalance.div(2);
  //   const tokenBefore = await getBalance(tokenAddr, parent1Wallet.address, provider);
  //   await parent1.contract.withdrawFundsFromChild(diffExpected, child1.address);
  //   const tokenAfter = await getBalance(tokenAddr, parent1Wallet.address, provider);
  //   const diff = tokenAfter.sub(tokenBefore);
  //   assert(diff.eq(diffExpected) && !diff.eq(0) , "The number of token did not increase properly");
  // });

  // it('Should reverse because trying to withdraw too much funds', async function () {
  //   const childBalance = await parent1.getChildBalance(child1.address);
  //   const tryingToSteal = childBalance.mul(2);
  //   await expect(
  //     parent1.contract.withdrawFundsFromChild(tryingToSteal, child1.address)
  //   ).to.be.revertedWith("!withdrawFundsFromChild: amount > childBalance"); 
  // });
});

