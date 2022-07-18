import { ethers, upgrades } from 'hardhat';
import { expect } from 'chai';
import {
  PocketFaucet__factory,
  PocketFaucet,
  PocketFaucetV2__factory,
  PocketFaucetV2,
} from '../typechain-types';
import { ProxyAdmin } from '../typechain-types';
import * as constants from '../utils/constants';
import { Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { abi as proxyAbi } from '../artifacts/@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol/ProxyAdmin.json';

describe('Deploy and tests on proxy functions', function () {
  const ___log = console.log;

  function mute() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    console.log = function () {};
  }

  function unmute() {
    console.log = ___log;
  }

  let PocketFaucet_factory: PocketFaucet__factory, pocketFaucet: PocketFaucet;
  let PocketFaucetV2_factory: PocketFaucetV2__factory,
    pocketFaucetV2: PocketFaucetV2;
  let admin: SignerWithAddress,
    testAccount1: SignerWithAddress,
    badActor: SignerWithAddress;
  let proxyAdmin: ProxyAdmin;

  before(async function () {
    [admin, testAccount1, badActor] = await ethers.getSigners();
    PocketFaucet_factory = await ethers.getContractFactory('PocketFaucet');
    pocketFaucet = (await upgrades.deployProxy(PocketFaucet_factory, [
      constants.TOKEN_POLY.USDC,
    ])) as PocketFaucet;
    await pocketFaucet.deployed();

    PocketFaucetV2_factory = await ethers.getContractFactory('PocketFaucetV2');
    pocketFaucetV2 = await PocketFaucetV2_factory.deploy();
    await pocketFaucetV2.deployed();

    const proxyAddr = (await upgrades.admin.getInstance()).address;
    proxyAdmin = new Contract(proxyAddr, proxyAbi) as ProxyAdmin;
  });

  it('Should have set baseToken', async function () {
    expect(await pocketFaucet.baseToken()).to.equal(
      constants.TOKEN_RINKEBY.FAKEUSDC
    );
  });

  it('Should have set good admin for proxy + owner of proxyAdmin', async function () {
    expect(await proxyAdmin.connect(admin).owner()).to.be.equal(admin.address);
    expect(
      await proxyAdmin.connect(admin).getProxyAdmin(pocketFaucet.address)
    ).to.be.equal(proxyAdmin.address);
  });

  describe('Change owner and proxyAdmin', function () {
    it('Should fail to change proxy admin if its not the proxy owner', async function () {
      await expect(
        proxyAdmin
          .connect(badActor)
          .changeProxyAdmin(pocketFaucet.address, testAccount1.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should change proxyAdmin owner', async function () {
      mute();
      await upgrades.admin.transferProxyAdminOwnership(testAccount1.address);
      unmute();
      expect(await proxyAdmin.connect(testAccount1).owner()).to.be.equal(
        testAccount1.address
      );
      await proxyAdmin.connect(testAccount1).transferOwnership(admin.address);
      expect(await proxyAdmin.connect(admin).owner()).to.be.equal(
        admin.address
      );
    });

    it('Should fail to change proxyAdmin owner if badActor', async function () {
      await expect(
        proxyAdmin.connect(badActor).transferOwnership(badActor.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('Proxy implementation', function () {
    it('Should return proxy implementation address', async function () {
      const implAddress = await proxyAdmin
        .connect(admin)
        .getProxyImplementation(pocketFaucet.address);
      const realImplAddr = await upgrades.erc1967.getImplementationAddress(
        pocketFaucet.address
      );
      expect(implAddress).to.be.equal(realImplAddr);
    });
  });

  describe('Upgrades', function () {
    it('Should fail to upgrade if badActor', async function () {
      await expect(
        proxyAdmin
          .connect(badActor)
          .upgrade(pocketFaucet.address, pocketFaucetV2.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should upgrade implementation', async function () {
      const pocketV1Addr = await upgrades.erc1967.getImplementationAddress(
        pocketFaucet.address
      );
      await upgrades.upgradeProxy(pocketFaucet.address, PocketFaucetV2_factory);
      expect(pocketV1Addr).to.not.be.equal(
        await upgrades.erc1967.getImplementationAddress(pocketFaucet.address)
      );
    });

    // it('Should have access to new variable', async function () {
    // 	expect(await (pocketFaucet as PocketFaucetV2).connect(admin).newVar()).to.be.equal(42)
    // });
  });
});
