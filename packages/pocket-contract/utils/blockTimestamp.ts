import * as hre from 'hardhat';
import '@nomiclabs/hardhat-ethers';
import { BigNumber } from 'ethers';

// TO DO : remove everywhere for time.latest()
export async function blockTimestamp() {
  const blockInfo = (await hre.network.provider.request({
    method: 'eth_getBlockByNumber',
    params: ['latest', false],
  })) as { timestamp: string };
  return BigNumber.from(blockInfo.timestamp);
  // parseInt(blockInfo.timestamp, 16);
}
