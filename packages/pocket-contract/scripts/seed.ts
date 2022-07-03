import { Wallet, providers } from 'ethers';
import { ParentContract } from '../ts/Parent';
import { setErc20Balance } from '../utils/ERC20';
import * as constants from '../utils/constants';

require('dotenv').config();

const ELON_MUSK = {
  publicKey: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  privateKey:
    '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
};

const DAMIAN_MUSK = {
  publicKey: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
  privateKey:
    '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
};

async function main() {
  const provider = new providers.JsonRpcProvider('http://localhost:8545');
  const parentWallet = new Wallet(
    ELON_MUSK.privateKey, // Elon Musk's Wallet
    provider
  );
  const parent = new ParentContract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
    parentWallet
  );

  const tx = await parent.addChild(20, 0, DAMIAN_MUSK.publicKey); // Damian Musk's Wallet
  const res = await provider.sendTransaction(tx);

  // Transfer some USDT to Elon Musk
  await setErc20Balance(
    constants.TOKEN_POLY.USDC,
    parentWallet,
    '3000',
    constants.WHALES_POLY.USDC
  );

  console.log('Contract seeding complete !');
}

main().catch((e) => console.error(e));
