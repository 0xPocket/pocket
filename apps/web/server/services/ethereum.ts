import { TRPCError } from '@trpc/server';
import { providers, Wallet } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { PocketFaucet__factory } from 'pocket-contract/typechain-types';
import { env } from '../env';
import { prisma } from '../prisma';
import { UserChild } from '../utils/sanitizeUser';

const provider = new providers.JsonRpcProvider(env.NEXT_PUBLIC_RPC_ENDPOINT);
const wallet = new Wallet(env.POCKET_PRIVATE_KEY, provider);
const pocketContract = PocketFaucet__factory.connect(
  env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  provider,
);

const AMOUNT_TO_SEND = parseEther('20');

export async function grantMaticToChild(child: UserChild) {
  const config = await pocketContract.childToConfig(child.address!);

  if (config.balance.eq(0)) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'You must have a balance in your pocket to claim your Matic',
    });
  }

  const tx = await wallet.sendTransaction({
    to: child.address!,
    value: AMOUNT_TO_SEND,
  });

  tx.wait().then(async () => {
    await prisma.child.update({
      where: {
        userId: child.id,
      },
      data: {
        maticClaimed: true,
      },
    });
  });

  return tx;
}
