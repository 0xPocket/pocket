/* eslint-disable no-unused-vars */
import { assert, expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { Wallet } from 'ethers';
import ParentTester from '../ts/ParentTester';
import * as constants from '../utils/constants';
import { PocketFaucet__factory, PocketFaucet } from '../typechain-types';
import config from 'config/network';
import { stringToDecimalsVersion } from '../utils/ERC20';

describe('Testing add Child and funds', function () {
  let child1: Wallet;
  let parent1: ParentTester;
  let PocketFaucet_factory: PocketFaucet__factory, pocketFaucet: PocketFaucet;
  let parent1Wallet: Wallet;
  const tokenAddr = constants.CHOSEN_TOKEN;
  const whale = constants.CHOSEN_WHALE;
  before(async function () {
    child1 = new Wallet(constants.FAMILY_ACCOUNT.child1, ethers.provider);
    PocketFaucet_factory = await ethers.getContractFactory('PocketFaucet');
    pocketFaucet = (await upgrades.deployProxy(PocketFaucet_factory, [
      tokenAddr,
      config.localhost.TRUSTED_FORWARDER,
    ])) as PocketFaucet;
    await pocketFaucet.deployed();
    parent1Wallet = new Wallet(
      constants.FAMILY_ACCOUNT.parent1,
      ethers.provider
    );
    parent1 = new ParentTester(pocketFaucet.address, parent1Wallet);
  });

  // it('Should revert because new child addr is zero', async function () {
  //   await expect(
  //     parent1.addChildAndFundsAndSend(
  //       1,
  //       1,
  //       ethers.constants.AddressZero,
  //       0,
  //       tokenAddr,
  //       whale
  //     )
  //   ).to.be.revertedWith('!addChild: Address is null');
  // });

  // it('Should revert because child2 is already set', async function () {
  //   await parent1.addStdChildAndSend(child1.address, tokenAddr);
  //   await expect(
  //     parent1.addChildAndFundsAndSend(1, 1, child1.address, 0, tokenAddr, whale)
  //   ).to.be.revertedWith('!addChild: Child address already taken');
  // });

  // it('Should add 1 child and give him 0', async function () {
  //   await parent1.addChildAndFundsAndSend(
  //     1,
  //     1,
  //     constants.RDM_ADDRESS[1],
  //     0,
  //     tokenAddr,
  //     whale
  //   );
  //   assert(
  //     (await parent1.getNbChildren()) === 2,
  //     'Number of children is not good'
  //   );
  //   assert(
  //     (await parent1.getChildBalance(constants.RDM_ADDRESS[1])).isZero(),
  //     'This child has not got the right balance'
  //   );
  // });

  // it('Should revert because addFunds did not work', async function () {
  //   await expect(
  //     parent1.addChildAndFundsAndSend(
  //       1,
  //       1,
  //       constants.RDM_ADDRESS[2],
  //       5,
  //       tokenAddr,
  //       null
  //     )
  //   ).to.be.revertedWith(constants.CHOSEN_ERRORMSG);
  // });

  // it('Should add 1 child and give him money', async function () {
  //   await parent1.addChildAndFundsAndSend(
  //     1,
  //     1,
  //     constants.RDM_ADDRESS[2],
  //     15,
  //     tokenAddr,
  //     whale
  //   );
  //   assert(
  //     (await parent1.getNbChildren()) === 3,
  //     'Number of children is not good'
  //   );
  //   assert(
  //     (await parent1.getChildBalance(constants.RDM_ADDRESS[2])).eq(
  //       await stringToDecimalsVersion(tokenAddr, '15')
  //     ),
  //     'This child has not got the right balance'
  //   );
  //   assert(
  //     (await parent1.getChildBalance(constants.RDM_ADDRESS[1])).eq(
  //       await stringToDecimalsVersion(tokenAddr, '0')
  //     ),
  //     'This child has not got the right balance'
  //   );
  // });
});
