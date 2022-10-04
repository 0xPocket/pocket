import { PocketFaucet } from '../typechain-types';
import { User } from './testSetup';

const getChildConfig = (childAddr: string, pocketFaucet: PocketFaucet) => {
  return pocketFaucet.childToConfig(childAddr);
};

const getActive = async (address: string, pocketFaucet: PocketFaucet) => {
  return (await getChildConfig(address, pocketFaucet)).active;
};

const getCeiling = async (address: string, pocketFaucet: PocketFaucet) => {
  return (await getChildConfig(address, pocketFaucet)).ceiling;
};

const getLastClaim = async (address: string, pocketFaucet: PocketFaucet) => {
  return (await getChildConfig(address, pocketFaucet)).lastClaim;
};

const getParent = async (address: string, pocketFaucet: PocketFaucet) => {
  return (await getChildConfig(address, pocketFaucet)).parent;
};

const getPeriodicity = async (address: string, pocketFaucet: PocketFaucet) => {
  return (await getChildConfig(address, pocketFaucet)).periodicity;
};

const getChildren = async (parent: User) => {
  const childrenAddresses: string[] = [];
  const length: number = (
    await parent.pocketFaucet.getNumberChildren(parent.address)
  ).toNumber();

  for (let i = 0; i < length; i++)
    childrenAddresses.push(
      await parent.pocketFaucet.parentToChildren(parent.address, i)
    );

  return childrenAddresses;
};

const checkChildIsInit = async (parent: User, childAddr: string) => {
  let ret = false;
  const childConfig = await parent.pocketFaucet.childToConfig(childAddr);
  if (childConfig.parent !== parent.address) return ret;
  const children = await getChildren(parent);
  children.forEach((child) => {
    if (child === childAddr) ret = true;
  });
  return ret;
};

export {
  getActive,
  getCeiling,
  getLastClaim,
  getParent,
  getPeriodicity,
  checkChildIsInit,
};
