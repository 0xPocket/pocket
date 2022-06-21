/* eslint-disable no-unused-vars */
import { assert, expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { BigNumber, providers, Wallet } from 'ethers';
import ParentTester from '../helpers/ParentTester';
import * as constants from "../utils/constants"
import { PocketFaucet__factory, PocketFaucet, IERC20MetadataUpgradeable } from "../typechain-types";
// import { assert } from 'console';
import goForwardNDays from '../utils/goForward';
import { getBalance, getDecimals, setAllowance, setErc20Balance } from '../utils/ERC20';

describe('Testing conf changement', function () {
  let child1: Wallet, child2: Wallet;
  let parent1: ParentTester;
  let PocketFaucet_factory: PocketFaucet__factory, pocketFaucet: PocketFaucet;
  let provider : providers.JsonRpcProvider;
  let parent1Wallet: Wallet;
  
  before(async function () {
    provider = new providers.JsonRpcProvider("http://localhost:8545");
    child1 = new Wallet(constants.FAMILY_ACCOUNT.child1, provider);
    child2 = new Wallet(constants.FAMILY_ACCOUNT.child2, provider);

    PocketFaucet_factory = await ethers.getContractFactory('PocketFaucet');
    pocketFaucet = await upgrades.deployProxy(PocketFaucet_factory, [constants.TOKEN_POLY.JEUR]) as PocketFaucet;
    await pocketFaucet.deployed();
    parent1Wallet = new Wallet(constants.FAMILY_ACCOUNT.parent1, provider);
    parent1 = new ParentTester(pocketFaucet.address, parent1Wallet);
    await parent1.addStdChildAndSend(child1.address, constants.TOKEN_POLY.JEUR);
  });

  it('Should revert because new child addr is zero', async function () {
    await expect(
      parent1.changeConfigAndSend(0, 0, ethers.constants.AddressZero)
    ).to.be.revertedWith("!_areRelated : null child address"); 
  });

  it('Should revert because child2 is not set for this parent', async function () {
    await expect(
      parent1.changeConfigAndSend(0, 0, child2.address)
    ).to.be.revertedWith("!_areRelated : child doesn't match"); 
  });

  it('Should revert because child1 is not set anymore', async function () {
    await parent1.removeChild(child1.address);
    await expect(
      parent1.changeConfigAndSend(0, 0, child1.address)
    ).to.be.revertedWith("!_areRelated : child doesn't match"); 
  });

  it('Should change ceiling', async function () {
    await parent1.addStdChildAndSend(child1.address, constants.TOKEN_POLY.JEUR);
    const ceilingBefore = await parent1.getCeiling(child1.address);
    await parent1.changeConfigAndSend(10, 0, child1.address)
    const ceilingAfter = await parent1.getCeiling(child1.address);
    assert(!ceilingAfter.eq(ceilingBefore), "Ceiling value did not change");
  });

  it('Should not change lastClaim', async function () {
    const lastClaimBefore = await parent1.getLastClaim(child1.address);
    await parent1.changeConfigAndSend(20, 0, child1.address)
    const lastClaimAfter = await parent1.getLastClaim(child1.address);
    assert(lastClaimAfter.eq(lastClaimBefore), "Last claim value changed: " + lastClaimAfter + " vs " + lastClaimBefore );
  });

  it('Should not change parent param', async function () {
    const parentBefore = await parent1.getParent(child1.address);
    await parent1.changeConfigAndSend(10, 0, child1.address)
    const parentAfter = await parent1.getParent(child1.address);
    assert(parentAfter === parentBefore, "Parent value changed");
  });

  it('Should change periodicity', async function () {
    const newPeriodicity = 2000;
    const periodicityBefore = await parent1.getPeriodicity(child1.address);
    await parent1.changeConfigAndSend(10, newPeriodicity, child1.address);
    const periodicityAfter = await parent1.getPeriodicity(child1.address);
    assert(!periodicityAfter.eq(periodicityBefore), "Periodicity value is wrong: " + periodicityAfter.toString());
  });
});

