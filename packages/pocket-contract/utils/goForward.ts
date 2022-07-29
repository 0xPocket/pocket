import * as constants from '../utils/constants';
import { ethers } from 'hardhat';

export default async function goForwardNDays(nbDays: number) {
  let block = await ethers.provider.getBlock(
    await ethers.provider.getBlockNumber()
  );
  let timestampBefore = block.timestamp;
  for (let i = 0; i < nbDays; i++) {
    block = await ethers.provider.getBlock(
      await ethers.provider.getBlockNumber()
    );
    timestampBefore = block.timestamp;
    await ethers.provider.send('evm_mine', [
      timestampBefore + constants.TIME.DAY,
    ]);
  }
}
