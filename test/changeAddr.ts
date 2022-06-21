/* eslint-disable no-unused-vars */
import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { providers, Wallet } from 'ethers';
import ParentTester from '../helpers/ParentTester';
import * as constants from "../utils/constants"
import { PocketFaucet__factory, PocketFaucet, IERC20MetadataUpgradeable } from "../typechain-types";
import { assert } from 'console';
import goForwardNDays from '../utils/goForward';
import { getBalance, getDecimals, setAllowance, setErc20Balance } from '../utils/ERC20';

describe('Testing addr changement', function () {
  let child1: Wallet, child2: Wallet;
  let parent1: ParentTester, parent2: ParentTester;
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
    parent2 = new ParentTester(pocketFaucet.address, new Wallet(constants.FAMILY_ACCOUNT.parent2, provider));
    
    await provider.sendTransaction(await parent1.addChild(ethers.utils.parseUnits("10",  await getDecimals(constants.TOKEN_POLY.JEUR, provider)), 604800, child1.address));
  });

  it('Should reverse because child2 is not parent1 child', async function () {
    await expect(
      parent1.changeChildAddress(child2.address, child1.address)
    ).to.be.revertedWith("!_areRelated : child doesn't match"); 
  });

  it('Should change child1 to child2 for parent1', async function () {
    await parent1.changeChildAddress(child1.address, child2.address);
    const child1IsInit = await parent1.checkChildIsInit(child1.address);
    const child2IsInit = await parent1.checkChildIsInit(child2.address);
    assert(child1IsInit === false && child2IsInit === true, "Child1 should not be set for parent1/Child2 should be set for parent1");
  });

  it('Should test that new child2 can withdraw', async function () {
    const toSend = ethers.utils.parseUnits("100",  await getDecimals(constants.TOKEN_POLY.JEUR, provider));
    const tokenBefore = await getBalance(constants.TOKEN_POLY.JEUR, child2.address, provider);
    await goForwardNDays("http://localhost:8545", 21);
    await setErc20Balance(constants.TOKEN_POLY.JEUR, parent1Wallet, "100", constants.WHALES_POLY.JEUR);
    await setAllowance(constants.TOKEN_POLY.JEUR, parent1Wallet, pocketFaucet.address, toSend.toString());
    await parent1.addFunds(toSend, child2.address);
    await pocketFaucet.connect(child2).claim();
    assert(tokenBefore.lt(await getBalance(constants.TOKEN_POLY.JEUR, child2.address, provider)), "Child2 number of token did not increased");
  });
});

