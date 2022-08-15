/* eslint-disable no-unused-vars */
import { assert, expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { Wallet } from 'ethers';
import ParentTester from '../helpers/ParentTester';
import * as constants from '../utils/constants';
import { PocketFaucet__factory, PocketFaucet } from '../typechain-types';
import goForwardNDays from '../utils/goForward';
import {
  getERC20Balance,
  getDecimals,
  setAllowance,
  setErc20Balance,
} from '../utils/ERC20';

describe('Testing addr changement', function () {
  let child1: Wallet, child2: Wallet;
  let parent1: ParentTester, parent2: ParentTester;
  let PocketFaucet_factory: PocketFaucet__factory, pocketFaucet: PocketFaucet;
  let parent1Wallet: Wallet, parent2Wallet: Wallet;
  const tokenAddr = constants.CHOSEN_TOKEN;

  before(async function () {
    child1 = new Wallet(constants.FAMILY_ACCOUNT.child1, ethers.provider);
    child2 = new Wallet(constants.FAMILY_ACCOUNT.child2, ethers.provider);

    PocketFaucet_factory = await ethers.getContractFactory('PocketFaucet');
    pocketFaucet = (await upgrades.deployProxy(PocketFaucet_factory, [
      tokenAddr,
    ])) as PocketFaucet;
    await pocketFaucet.deployed();
    parent1Wallet = new Wallet(
      constants.FAMILY_ACCOUNT.parent1,
      ethers.provider
    );
    parent2Wallet = new Wallet(
      constants.FAMILY_ACCOUNT.parent2,
      ethers.provider
    );
    parent1 = new ParentTester(pocketFaucet.address, parent1Wallet);
    parent2 = new ParentTester(pocketFaucet.address, parent2Wallet);
    await parent1.addStdChildAndSend(child1.address, tokenAddr);
  });

  it('Should reverse because child2 is not parent1 child', async function () {
    await expect(
      parent1.changeChildAddress(child2.address, child1.address)
    ).to.be.revertedWith("!_areRelated: child doesn't match");
  });

  it('Should change child1 to child2 for parent1', async function () {
    await parent1.changeChildAddress(child1.address, child2.address);
    const child1IsInit = await parent1.checkChildIsInit(child1.address);
    const child2IsInit = await parent1.checkChildIsInit(child2.address);
    assert(
      child1IsInit === false && child2IsInit === true,
      'Child1 should not be set for parent1/Child2 should be set for parent1'
    );
  });

  it('Should test that new child2 can withdraw', async function () {
    const toSend = ethers.utils.parseUnits('10', await getDecimals(tokenAddr));
    const tokenBefore = await getERC20Balance(tokenAddr, child2.address);
    await goForwardNDays(21);
    await setErc20Balance(
      tokenAddr,
      parent1Wallet,
      '10',
      constants.CHOSEN_WHALE
    );
    await setAllowance(
      tokenAddr,
      parent1Wallet,
      pocketFaucet.address,
      toSend.toString()
    );
    await parent1.addFunds(toSend, child2.address);
    await pocketFaucet.connect(child2).claim({ gasLimit: 3000000 });
    assert(
      tokenBefore.lt(await getERC20Balance(tokenAddr, child2.address)),
      'Child2 number of token did not increased'
    );
  });

  it('Should change parent1 to parent2', async function () {
    await parent1.changeParentAddress(parent2.address);
    const child1IsInit = await parent2.checkChildIsInit(child1.address);
    const child2IsInit = await parent2.checkChildIsInit(child2.address);
    const nbChildParent1 = await parent1.getNbChildren();

    assert(
      child1IsInit === false && child2IsInit === true && nbChildParent1 === 0,
      'Child1 should not be set for parent1/Child2 should be set for parent1'
    );
  });

  it('Should reverse because trying to change to same address is not possible', async function () {
    await expect(
      parent1.changeParentAddress(parent1.address)
    ).to.be.revertedWith('!changeParentAddr : can not change to same addr');
  });

  it('Should change parent2 to parent1', async function () {
    await parent2.changeParentAddress(parent1.address);
    await parent1.addStdChildAndSend(child1.address, tokenAddr);
    const child1IsInit = await parent1.checkChildIsInit(child1.address);
    const child2IsInit = await parent1.checkChildIsInit(child2.address);
    const child1IsInitP2 = await parent2.checkChildIsInit(child1.address);
    const child2IsInitP2 = await parent2.checkChildIsInit(child2.address);
    const nbChildParent2 = await parent2.getNbChildren();
    const nbChildParent1 = await parent1.getNbChildren();
    assert(
      child1IsInit === true &&
        child2IsInit === true &&
        child1IsInitP2 === false &&
        child2IsInitP2 === false &&
        nbChildParent2 === 0 &&
        nbChildParent1 === 2,
      'Child1 and Child2 should be set for parent1 and not for P2'
    );
  });

  it('Should reverse because trying to change to same address is not possible', async function () {
    await parent1.changeParentAddress(parent2.address);
    const nbChildParent1 = await parent1.getNbChildren();
    const nbChildParent2 = await parent2.getNbChildren();
    assert(
      nbChildParent1 === 0 && nbChildParent2 === 2,
      'Parent1 should have 0 children and parent2 2'
    );
    //  await expect(
    //    parent2.changeParentAddress(parent2.address)
    //  ).to.revert();
  });
});
