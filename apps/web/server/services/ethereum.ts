import { TRPCError } from '@trpc/server';
import { providers, Wallet } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { PocketFaucet__factory } from 'pocket-contract/typechain-types';
import { env } from '../env';
import { prisma } from '../prisma';
import type { UserChild, UserParent } from '../utils/sanitizeUser';

const provider = new providers.JsonRpcProvider(env.NEXT_PUBLIC_RPC_ENDPOINT);
const wallet = new Wallet(env.POCKET_PRIVATE_KEY, provider);
const pocketContract = PocketFaucet__factory.connect(
  env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  provider,
);

const AMOUNT_TO_SEND_TO_CHILD = parseEther('20');
const AMOUNT_TO_SEND_TO_PARENT = parseEther('10');
const AMOUNT_OF_GRANTS = 5;

async function getPriorityFeeData() {
  const feeData = await wallet.getFeeData();

  if (
    !feeData.gasPrice ||
    !feeData.maxFeePerGas ||
    !feeData.maxPriorityFeePerGas
  ) {
    return undefined;
  }

  return {
    ...feeData,
    maxFeePerGas: feeData.maxFeePerGas.add(feeData.maxFeePerGas.div(4)),
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas.add(
      feeData.maxPriorityFeePerGas.div(4),
    ),
  };
}

export async function grantMaticToChild(child: UserChild) {
  const config = await pocketContract.childToConfig(child.address!);

  if (config.balance.isZero()) {
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

  if (parent && parent.maticGrants <= 0) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: "You can't claim Matic because your parent have no grants",
    });
  }

  const txArgs: providers.TransactionRequest = {
    to: child.address!,
    value: AMOUNT_TO_SEND_TO_CHILD,
  };

  const feeData = await getPriorityFeeData();

  if (!feeData) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Server error',
    });
  }

  await prisma.parent.update({
    where: {
      userId: child.parentUserId,
    },
    data: {
      maticGrants: {
        decrement: 1,
      },
    },
  });

  const maticGrant = await prisma.maticGrant.create({
    data: {
      userId: child.id,
      amount: AMOUNT_TO_SEND_TO_CHILD.toHexString(),
    },
  });

  const tx = await wallet
    .sendTransaction({
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      ...txArgs,
    })
    .catch(async () => {
      await prisma.$transaction([
        prisma.parent.update({
          where: {
            userId: child.parentUserId,
          },
          data: {
            maticGrants: {
              increment: 1,
            },
          },
        }),
        prisma.maticGrant.delete({
          where: {
            id: maticGrant.id,
          },
        }),
      ]);

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Server error',
      });
    });

  tx.wait().then(async () => {
    await prisma.maticGrant.update({
      where: {
        id: maticGrant.id,
      },
      data: {
        hash: tx.hash,
      },
    });
  });

  return tx;
}

export async function grantMaticToParent(parent: UserParent) {
  const txArgs: providers.TransactionRequest = {
    to: parent.address!,
    value: AMOUNT_TO_SEND_TO_PARENT,
  };

  const feeData = await getPriorityFeeData();

  if (!feeData) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Server error',
    });
  }

  const tx = await wallet
    .sendTransaction({
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      ...txArgs,
    })
    .catch(async () => {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Server error',
      });
    });

  tx.wait().then(async () => {
    await prisma.$transaction([
      prisma.parent.update({
        where: {
          userId: parent.id,
        },
        data: {
          maticGrants: {
            increment: AMOUNT_OF_GRANTS,
          },
        },
      }),
      prisma.maticGrant.create({
        data: {
          userId: parent.id,
          amount: AMOUNT_TO_SEND_TO_PARENT.toHexString(),
        },
      }),
    ]);
  });
}
