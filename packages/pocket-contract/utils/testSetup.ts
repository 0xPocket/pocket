import {
  deployments,
  ethers,
  getNamedAccounts,
  getUnnamedAccounts,
} from 'hardhat';
import { PocketFaucet } from '../typechain-types';
import { Contract } from 'ethers';

export interface User {
  address: string;
  pocketFaucet: PocketFaucet;
}

async function setupUsers<T extends { [contractName: string]: Contract }>(
  namedAccounts: { [name: string]: string },
  contracts: T
) {
  const parents: ({ address: string } & T)[] = [];
  const children: ({ address: string } & T)[] = [];

  for (const name in namedAccounts) {
    if (name.includes('child'))
      children.push(await setupUser(namedAccounts[name], contracts));
    else if (name.includes('parent'))
      parents.push(await setupUser(namedAccounts[name], contracts));
  }

  return { parents, children };
}

async function setupRandomUsers<T extends { [contractName: string]: Contract }>(
  addresses: string[],
  contracts: T
) {
  const randomUsers: ({ address: string } & T)[] = [];
  for (const address of addresses) {
    randomUsers.push(await setupUser(address, contracts));
  }

  return randomUsers;
}

async function setupUser<T extends { [contractName: string]: Contract }>(
  address: string,
  contracts: T
): Promise<{ address: string } & T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = { address };
  for (const key of Object.keys(contracts)) {
    user[key] = contracts[key].connect(await ethers.getSigner(address));
  }

  return user as { address: string } & T;
}

const setup = deployments.createFixture(async () => {
  await deployments.fixture('PocketFaucet');

  const contracts = {
    pocketFaucet: <PocketFaucet>await ethers.getContract('PocketFaucet'),
  };
  const randomUsers = await setupRandomUsers(
    await getUnnamedAccounts(),
    contracts
  );
  const { parents, children } = await setupUsers(
    await getNamedAccounts(),
    contracts
  );

  return {
    contracts,
    parents,
    children,
    randomUsers,
  };
});

export default setup;
