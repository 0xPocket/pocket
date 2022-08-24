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

  const grant = await prisma.maticGrant.findFirst({
    where: {
      userId: child.id,
    },
  });

  if (grant) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Matic already claimed',
    });
  }

  const parent = await prisma.parent.findUnique({
    where: {
      userId: child.parentUserId,
    },
  });

  if (parent?.maticGrants === 0) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: "You can't claim Matic because your parent have no grants",
    });
  }

  const tx = await wallet
    .sendTransaction({
      to: child.address!,
      value: AMOUNT_TO_SEND,
    })
    .catch(() => {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Server error',
      });
    });

  await prisma
    .$transaction([
      prisma.parent.update({
        where: {
          userId: child.parentUserId,
        },
        data: {
          maticGrants: {
            decrement: 1,
          },
        },
      }),
      prisma.maticGrant.create({
        data: {
          userId: child.id,
          amount: tx.value.toHexString(),
          hash: tx.hash,
        },
      }),
    ])
    .catch(() => {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Server error',
      });
    });

  tx.wait().then(async () => {
    // ?
  });

  return tx;
}
