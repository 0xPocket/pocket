import * as constants from '../utils/constants';
import { ethers } from 'hardhat';

export default async function goForwardNDays(rpcUrl: string, nbDays: number) {
  const netProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
  let block = await netProvider.getBlock(await netProvider.getBlockNumber());
  let timestampBefore = block.timestamp;
  for (let i = 0; i < nbDays; i++) {
    block = await netProvider.getBlock(await netProvider.getBlockNumber());
    timestampBefore = block.timestamp;
    await netProvider.send('evm_mine', [timestampBefore + constants.TIME.DAY]);
  }
}
