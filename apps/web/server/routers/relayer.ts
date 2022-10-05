import { TRPCError } from '@trpc/server';
import { env } from 'config/env/server';
import { PocketFaucetAbi } from 'pocket-contract/abi';
import {
  Forwarder,
  Forwarder__factory,
  PocketFaucet__factory,
} from 'pocket-contract/typechain-types';
import { z } from 'zod';
import { createProtectedRouter } from '../createRouter';
import { getParsedEthersError } from '@enzoferey/ethers-error-parser';
import axios from 'axios';
import { DOMAIN_SELECTOR_HASH, relayerSigner, TYPE_HASH } from '../ethereum';

const http = axios.create({
  baseURL: 'https://api.starton.io/v2',
  headers: {
    'x-api-key': env.STARTON_KEY,
  },
});

type StartonSmartContractCallResponse = {
  id: string;
  to: string;
  transactionHash: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
};

type ExecuteParams = Forwarder['functions']['execute'] extends (
  ...args: infer P
) => unknown
  ? P
  : never;

const startonRelayer = async (params: ExecuteParams) => {
  return http
    .post<StartonSmartContractCallResponse>(
      `/smart-contract/${env.NETWORK_KEY}/${env.TRUSTED_FORWARDER}/call`,
      {
        functionName:
          'execute((address,address,uint256,uint256,uint256,bytes,uint256),bytes32,bytes32,bytes,bytes)',
        signerWallet: env.SIGNER_WALLET, // test wallet
        speed: 'fast',
        params,
      },
    )
    .then((res) => res.data);
};

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

    const forwarder = Forwarder__factory.connect(
      env.TRUSTED_FORWARDER,
      relayerSigner,
    );

    const gasLimit = (request.gas + 300000).toString();

    const paramsTuple = [
      request,
      DOMAIN_SELECTOR_HASH,
      TYPE_HASH,
      '0x',
      signature,
    ] as const;

    const staticCall = await forwarder.callStatic.execute(...paramsTuple, {
      gasLimit,
    });

    if (!staticCall.success) {
      try {
        PocketFaucet__factory.getInterface(
          PocketFaucetAbi,
        ).decodeFunctionResult(input.functionName, staticCall.ret);
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error = getParsedEthersError(e as any);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.context,
        });
      }
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Error during the transaction',
      });
    }

    if (env.NODE_ENV === 'development') {
      const tx = await forwarder.execute(...paramsTuple, { gasLimit });

      return { txHash: tx.hash };
    }

    try {
      const tx = await startonRelayer([...paramsTuple]);

      return { txHash: tx.transactionHash };
    } catch (e) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Error relaying transaction, please reach us.',
      });
    }
  },
});
