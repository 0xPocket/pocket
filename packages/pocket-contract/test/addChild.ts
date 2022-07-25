/* eslint-disable no-unused-vars */
import { assert, expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { providers, Wallet } from 'ethers';
import ParentTester from '../helpers/ParentTester';
import * as constants from '../utils/constants';
import { PocketFaucet__factory, PocketFaucet } from '../typechain-types';

describe('Testing add Child', function () {
  let child1: Wallet;
  let parent1: ParentTester;
  let PocketFaucet_factory: PocketFaucet__factory, pocketFaucet: PocketFaucet;
  let provider: providers.JsonRpcProvider;
  let parent1Wallet: Wallet;
  const tokenAddr = constants.CHOSEN_TOKEN;

  before(async function () {
    provider = new providers.JsonRpcProvider(constants.RPC_URL.LOCAL);
    child1 = new Wallet(constants.FAMILY_ACCOUNT.child1, provider);
    PocketFaucet_factory = await ethers.getContractFactory('PocketFaucet');
    pocketFaucet = (await upgrades.deployProxy(PocketFaucet_factory, [
      tokenAddr,
    ])) as PocketFaucet;
    await pocketFaucet.deployed();
    parent1Wallet = new Wallet(constants.FAMILY_ACCOUNT.parent1, provider);
    parent1 = new ParentTester(pocketFaucet.address, parent1Wallet);
  });

  it('Should revert because new child addr is zero', async function () {
    await expect(
      parent1.changeConfigAndSend(0, 0, ethers.constants.AddressZero)
    ).to.be.revertedWith('!_areRelated: null child address');
  });

  it('Should revert because child2 is not set for this parent', async function () {
    await parent1.addStdChildAndSend(child1.address, tokenAddr);
    await expect(
      parent1.addStdChildAndSend(child1.address, tokenAddr)
    ).to.be.revertedWith('Child address already taken');
  });

  // it('Should add 20 children', async function () {
  //   for (let i = 0; i < 20; i++) {
  //     await parent1.addStdChildAndSend(constants.RDM_ADDRESS[i], tokenAddr);
  //   }
  //   assert(
  //     (await parent1.getNbChildren()) === 21,
  //     'Number of children is not good'
  //   );
  // });

  it('Should add 1 child', async function () {
    await parent1.addStdChildAndSend(constants.RDM_ADDRESS[1], tokenAddr);
    assert(
      (await parent1.getNbChildren()) === 2,
      'Number of children is not good'
    );
  });
});
