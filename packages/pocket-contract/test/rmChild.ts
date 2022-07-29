/* eslint-disable no-unused-vars */
import { assert, expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { providers, Wallet } from 'ethers';
import ParentTester from '../helpers/ParentTester';
import * as constants from '../utils/constants';
import { PocketFaucet__factory, PocketFaucet } from '../typechain-types';

describe('Testing rm child', function () {
  let child1: Wallet;
  let child2: Wallet;
  let parent1: ParentTester;
  let PocketFaucet_factory: PocketFaucet__factory, pocketFaucet: PocketFaucet;
  let parent1Wallet: Wallet;

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
    parent1 = new ParentTester(pocketFaucet.address, parent1Wallet);
  });

  it('Should remove child1', async function () {
    await parent1.addStdChildAndSend(child1.address, tokenAddr);
    await parent1.removeChild(child1.address);
    assert(
      (await parent1.checkChildIsInit(child1.address)) === false,
      'Child 1 is still related to parent1'
    );
  });

  it('Should revert because child2 is not set for this parent', async function () {
    await parent1.addStdChildAndSend(child1.address, tokenAddr);
    await expect(parent1.removeChild(child2.address)).to.be.revertedWith(
      "!_areRelated: child doesn't match"
    );
  });

  it('Should add multiple child and remove 2', async function () {
    await parent1.addStdChildAndSend(constants.RDM_ADDRESS[0], tokenAddr);
    await parent1.addStdChildAndSend(constants.RDM_ADDRESS[1], tokenAddr);
    await parent1.addStdChildAndSend(constants.RDM_ADDRESS[2], tokenAddr);
    await parent1.addStdChildAndSend(constants.RDM_ADDRESS[3], tokenAddr);
    await parent1.addStdChildAndSend(constants.RDM_ADDRESS[4], tokenAddr);
    await parent1.removeChild(constants.RDM_ADDRESS[1]);
    await parent1.removeChild(constants.RDM_ADDRESS[4]);
    await parent1.addStdChildAndSend(constants.RDM_ADDRESS[1], tokenAddr);
    await parent1.removeChild(constants.RDM_ADDRESS[0]);

    assert(
      (await parent1.checkChildIsInit(constants.RDM_ADDRESS[4])) === false &&
        (await parent1.checkChildIsInit(constants.RDM_ADDRESS[0])) === false,
      'The two child were not removed'
    );
  });
});
