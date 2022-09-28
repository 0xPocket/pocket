import { TRPCError } from '@trpc/server';
import { env } from 'config/env/server';
import { providers, Wallet } from 'ethers';
import { PocketFaucetAbi } from 'pocket-contract/abi';
import {
  Forwarder__factory,
  PocketFaucet__factory,
} from 'pocket-contract/typechain-types';
import { z } from 'zod';
import { createProtectedRouter } from '../createRouter';

const provider = new providers.JsonRpcProvider(env.RPC_URL);
const wallet = new Wallet(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  provider,
);

const DOMAIN_SELECTOR_HASH =
  '0x945494529cc799d5423e33fc3fe2dd3cf98063fe93e6c14af49f6f8c17a571ee';
const TYPE_HASH =
  '0x2510fc5e187085770200b027d9f2cc4b930768f3b2bd81daafb71ffeb53d21c4';

export const relayerRouter = createProtectedRouter().mutation('forward', {
  input: z.object({
    request: z.object({
      from: z.string(),
      to: z.string(),
      value: z.number(),
      gas: z.number(),
      nonce: z.number(),
      data: z.string(),
      validUntil: z.number(),
    }),
    signature: z.string(),
    functionName: z.string(),
  }),
  resolve: async ({ input }) => {
    const { request, signature } = input;

    const accepts = request.to === env.NEXT_PUBLIC_CONTRACT_ADDRESS;

    if (!accepts)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Request declined.',
      });

    const forwarder = Forwarder__factory.connect(env.TRUSTED_FORWARDER, wallet);

    const gasLimit = (request.gas + 300000).toString();

    const staticCall = await forwarder.callStatic.execute(
      request,
      DOMAIN_SELECTOR_HASH,
      TYPE_HASH,
      '0x',
      signature,
      { gasLimit },
    );

    if (!staticCall.success) {
      try {
        PocketFaucet__factory.getInterface(
          PocketFaucetAbi,
        ).decodeFunctionResult(input.functionName, staticCall.ret);
      } catch (e) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: e as string,
        });
      }
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Wrong transaction',
      });
    }

    const tx = await forwarder.execute(
      request,
      DOMAIN_SELECTOR_HASH,
      TYPE_HASH,
      '0x',
      signature,
      { gasLimit },
    );

    return { txHash: tx.hash };
  },
});
