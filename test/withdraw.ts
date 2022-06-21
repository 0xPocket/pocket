/* eslint-disable no-unused-vars */
import { expect, assert } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { providers, Wallet } from 'ethers';
import ParentTester from '../helpers/ParentTester';
import {AdminContract} from '../ts/Admin';
import * as constants from "../utils/constants"
import { PocketFaucet__factory, PocketFaucet } from "../typechain-types";
import { getBalance, sendErc20 } from '../utils/ERC20';

describe('Testing withdraw', function () {
  let child1: Wallet, child2: Wallet;
  let parent1: ParentTester;
  let PocketFaucet_factory: PocketFaucet__factory, pocketFaucet: PocketFaucet;
  let provider : providers.JsonRpcProvider;
  let parent1Wallet: Wallet;
  let adminWallet: Wallet;
  let adminContract: AdminContract;
  const tokenAddr = constants.TOKEN_POLY.JEUR;


  before(async function () {
    provider = new providers.JsonRpcProvider("http://localhost:8545");
    child1 = new Wallet(constants.FAMILY_ACCOUNT.child1, provider);
    child2 = new Wallet(constants.FAMILY_ACCOUNT.child2, provider);
    adminWallet = new Wallet(constants.HH_ACCOUNT.account0, provider)
    PocketFaucet_factory = await ethers.getContractFactory('PocketFaucet');
    pocketFaucet = await upgrades.deployProxy(PocketFaucet_factory, [tokenAddr]) as PocketFaucet;
    await pocketFaucet.deployed();
    parent1Wallet = new Wallet(constants.FAMILY_ACCOUNT.parent1, provider);
    parent1 = new ParentTester(pocketFaucet.address, parent1Wallet);
    await parent1.addStdChildAndSend(child1.address, tokenAddr);
    adminContract = new AdminContract(pocketFaucet.address, adminWallet);
  });

  it('should revert because there are no token', async function () {
    await expect(
      adminContract.withdrawToken(tokenAddr, "1000000")
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance"); 
  });


  it('should revert because not granted withdraw role', async function () {
    await expect(
      parent1.contract.withdrawToken(tokenAddr, "1000000")
    ).to.be.revertedWith("AccessControl: account 0xbcd4042de499d14e55001ccbb24a551f3b954096 \
is missing role 0x5d8e12c39142ff96d79d04d15d1ba1269e4fe57bb9d26f43523628b34ba108ec"); 
  });

  it('Should revert because there are no coin', async function () {
    await expect(
      adminContract.withdrawCoin("1000000")
    ).to.reverted;
  });

  it('should withdraw 1000000 token', async function () {
    await sendErc20(tokenAddr, adminWallet, pocketFaucet.address, "100", constants.WHALES_POLY.JEUR);
    const balanceBefore = await getBalance(tokenAddr, adminWallet.address, provider);
    await adminContract.withdrawToken(tokenAddr, "1000000")
    const balanceAfter = await getBalance(tokenAddr, adminWallet.address, provider);
    assert(balanceAfter.gt(balanceBefore) , "Amount of token did not increase");
  });

  it('should withdraw 10 ether', async function () {
    await adminWallet.sendTransaction({
      to: pocketFaucet.address,
      value: ethers.utils.parseEther("10")
    });    
    const balanceBefore = await provider.getBalance(adminWallet.address);
    await adminContract.withdrawCoin(ethers.utils.parseEther("10").toString());
    const balanceAfter = await provider.getBalance(adminWallet.address);
    assert(balanceAfter.gt(balanceBefore) , "Amount of token did not increase" );
  });

});

