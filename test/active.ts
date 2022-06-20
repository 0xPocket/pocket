/* eslint-disable no-unused-vars */
import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract, providers, Signer, Wallet } from 'ethers';
import ParentTester from '../helpers/ParentTester';
import * as constants from "../utils/constants"
import { PocketFaucet__factory, PocketFaucet } from "../typechain-types";
import { assert } from 'console';

describe('Testing active param change', function () {
  let master, child1: Wallet, child2: Wallet;
  let parent1: ParentTester, parent2: ParentTester;
  let PocketFaucet_factory: PocketFaucet__factory, pocketFaucet: PocketFaucet;

  before(async function () {
    const provider = new providers.JsonRpcProvider("http://localhost:8545");
    child1 = new Wallet(constants.child1, provider);
    child2 = new Wallet(constants.child2, provider);

    PocketFaucet_factory = await ethers.getContractFactory('PocketFaucet');
    pocketFaucet = await upgrades.deployProxy(PocketFaucet_factory, [constants.jeur_poly]) as PocketFaucet;
    await pocketFaucet.deployed();
    parent1 = new ParentTester(pocketFaucet.address, new Wallet(constants.parent1, provider));
    parent2 = new ParentTester(pocketFaucet.address, new Wallet(constants.parent2, provider));
    
    await provider.sendTransaction(await parent1.addChild(20, 7, child1.address));
    await provider.sendTransaction(await parent2.addChild(20, 7, child2.address));
  });

  it('Should change child1 active variable value', async function () {
    const activeBefore = await parent1.getActive(child1.address);
    await parent1.setActive(false, child1.address);
    const activeAfter = await parent1.getActive(child1.address);
    assert(activeAfter != activeBefore, "Active value did not change");
  });

  it('Should revert because not related', async function () {
    await expect(
      await parent1.setActive(false, child2.address)
    ).to.be.revertedWith("!_areRelated : child doesn't match");

  });
  
  
});

