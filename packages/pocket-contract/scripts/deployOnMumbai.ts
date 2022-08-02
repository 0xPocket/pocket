import { ethers, upgrades } from 'hardhat';
import * as constants from '../utils/constants';
import { readFileSync, writeFileSync } from 'fs';
import { exit } from 'process';
import { abi } from '../artifacts/contracts/PocketFaucet.sol/PocketFaucet.json';
import { Contract } from 'ethers';
import { PocketFaucet__factory } from '../typechain-types';

const childKey =
  '0x4e8faa1d6927dedfdf8b86a616af2dcf9333fe648481fa470a3828082c4fa670';

const parentKey =
  '0x884167056218e26ea3aabadd56c3b30e1575f0085b70c5db516ed1c12127f0f3';

// https://calibration-faucet.filswan.com/#/dashboard

async function main() {
  const child = new ethers.Wallet(childKey);
  const parent = new ethers.Wallet(parentKey, ethers.provider);

  // const faucet = PocketFaucet__factory.connect(
  // '0x318365c73a1ad21a7C736d2966D84D16b44aC765',
  // parent
  // );
  // const tx = await faucet.baseToken();

  // await tx.wait();
  // exit();
  const PocketFaucet = await ethers.getContractFactory('PocketFaucet');
  console.log('About to deploy proxy');
  const pocketFaucet = await upgrades.deployProxy(
    PocketFaucet,
    ['0xe11A86849d99F524cAC3E7A0Ec1241828e332C62'],
    { timeout: 0 }
  );

  await pocketFaucet.deployed();
  console.log('Contract deployed to ', pocketFaucet.address);
  //   console.log('Contract deployed to ', pocketFaucet.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
