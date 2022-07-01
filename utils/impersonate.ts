import * as hre from 'hardhat';
import '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';

export async function impersonate(address: string) {
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [address],
  });

  return await ethers.getSigner(address);
}

export async function stopImpersonate(address: string) {
  return await hre.network.provider.request({
    method: 'hardhat_stopImpersonatingAccount',
    params: [address],
  });
}
