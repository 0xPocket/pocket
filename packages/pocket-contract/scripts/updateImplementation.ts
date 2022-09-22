import { ethers, upgrades } from 'hardhat';
import { env } from 'config/env/server';

async function main() {
  console.log('Network selected :', env.NEXT_PUBLIC_NETWORK);
  const PocketFaucet2 = await ethers.getContractFactory('PocketFaucet2');
  if (!process.env.CONTRACT_TO_UPGRADE) throw new Error('Address not defined');
  const proxy = await upgrades.upgradeProxy(
    process.env.CONTRACT_TO_UPGRADE,
    PocketFaucet2
  );
  await proxy.deployed();
  console.log('addr : ', proxy.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
