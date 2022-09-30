import { PocketFaucet } from '../typechain-types';
import { User } from './testSetup';

const getChildConfig = (childAddr: string, pocketFaucet: PocketFaucet) => {
  return pocketFaucet.childToConfig(childAddr);
};

const getActive = async (address: string, pocketFaucet: PocketFaucet) => {
  const [active, , , , ,] = await getChildConfig(address, pocketFaucet);
  return active;
};

export default getActive;
