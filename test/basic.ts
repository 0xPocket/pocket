/* eslint-disable no-unused-vars */
import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract, Signer, Wallet } from 'ethers';
import ParentTester from '../helpers/ParentTester';

describe('Deploy for now', function () {
  let master, parent1Signer: SignerWithAddress;
  let pocketFaucet: Contract;
  const JEURAddr = '0x4e3decbb3645551b8a19f0ea1678079fcb33fb4c';
  let parent1: ParentTester;

  before(async function () {
    [master, parent1Signer] = await ethers.getSigners();
    const PocketFaucet = await ethers.getContractFactory('PocketFaucet');
    pocketFaucet = await upgrades.deployProxy(PocketFaucet, [JEURAddr]);
    await pocketFaucet.deployed();
    parent1 = new ParentTester(pocketFaucet.address, parent1Signer);
  });

  it('Should add a new child to parent1', async function () {
    // await pocketFaucet.connect(parent1Signer).addChild(1, 1, JEURAddr);
    expect((await parent1.checkChildIsInit(JEURAddr)) === true, 'GROS FAIL');
  });
});
