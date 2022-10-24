import { env } from 'config/env/client';
import * as dotenv from 'dotenv';

dotenv.config({
  path: '../../.env',
});

export const HH_ACCOUNT = {
  account0:
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  account1:
    '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
  account2:
    '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
  account3:
    '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
  account4:
    '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a',
  account5:
    '0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba',
  account6:
    '0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e',
  account7:
    '0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356',
  account8:
    '0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97',
  account9:
    '0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6',
  account10:
    '0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897',
  account11:
    '0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82',
  account12:
    '0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1',
  account13:
    '0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd',
  account14:
    '0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa',
  account15:
    '0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61',
  account16:
    '0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0',
  account17:
    '0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd',
  account18:
    '0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0',
  account19:
    '0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e',
};

export const FAMILY_ACCOUNT = {
  parent1: HH_ACCOUNT.account10,
  parent2: HH_ACCOUNT.account11,
  parent3: HH_ACCOUNT.account12,
  child1: HH_ACCOUNT.account13,
  child2: HH_ACCOUNT.account14,
  child3: HH_ACCOUNT.account15,
};

export const WHALES = {
  'eth-rinkeby': '0xe2e0256d6785d49ec7badcd1d44adbd3f6b0ab58',
  'polygon-mainnet': '0xe7804c37c13166fF0b37F5aE0BB07A3aEbb6e245',
  'polygon-mumbai': '0xe41c53eb9fce0ac9d204d4f361e28a8f28559d54',
  localhost: '0xe7804c37c13166fF0b37F5aE0BB07A3aEbb6e245',
};

export const ERROR_MSG = {
  'eth-rinkeby': 'balance too low',
  'polygon-mainnet': 'ERC20: transfer amount exceeds balance',
  'polygon-mumbai': 'ERC20: transfer amount exceeds balance',
  localhost: 'ERC20: transfer amount exceeds balance',
};

export const CHOSEN_TOKEN = env.ERC20_ADDRESS;
export const CHOSEN_WHALE = WHALES[env.NEXT_PUBLIC_NETWORK];
export const CHOSEN_ERRORMSG = ERROR_MSG[env.NEXT_PUBLIC_NETWORK];

export const RDM_ADDRESS = [
  '0xf977814e90da44bfa01b6295a0616a897441acec',
  '0xf277814e90da44bfa01b6295a0616a897441acec',
  '0xf917814e90da44bfa01b6295a0616a897441acec',
  '0xf971814e90da44bfa01b6295a0616a897441acec',
  '0xf977114e90da44bfa01b6295a0616a897441acec',
  '0xf977834e90da44bfa01b6295a0616a897441acec',
  '0xf977816e90da44bfa01b6295a0616a897441acec',
  '0xf977814a90da44bfa01b6295a0616a897441acec',
  '0xf977814e20da44bfa01b6295a0616a897441acec',
  '0xf977814e40da44bfa01b6295a0616a897441acec',
  '0xf977814e96da44bfa01b6295a0616a897441acec',
  '0xf977814e90fa44bfa01b6295a0616a897441acec',
  '0xf977814e90dc44bfa01b6295a0616a897441acec',
  '0xf977814e90da54bfa01b6295a0616a897441acec',
  '0xf977814e90da45bfa01b6295a0616a897441acec',
  '0xf977814e90da44efa01b6295a0616a897441acec',
  '0xf977814e90da44bea01b6295a0616a897441acec',
  '0xf977814e90da44bfe01b6295a0616a897441acec',
  '0xf977814e90da44bfa11b6295a0616a897441acec',
  '0xf977814e90da44bfa02b6295a0616a897441acec',
  '0xf977814e90da44bfa01b2295a0616a897441acec',
  '0xf977814e90da44bfa01b6495a0616a897441acec',
];

export const TIME = {
  WEEK: 604800,
  DAY: 86400,
};

export const DAMIAN_MUSK = {
  address: '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec',
  privateKey:
    '0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd',
};

export const XAVIER_MUSK = {
  address: '0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097',
  privateKey:
    '0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa',
};

export const LOLA_MUSK = {
  address: '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
  privateKey:
    '0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61',
};

export const ELON_MUSK = {
  address: '0xBcd4042DE499D14e55001CcbB24a551F3b954096',
  privateKey:
    '0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897',
};

export const CONTRACT_OWNER = {
  privateKey:
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
};
