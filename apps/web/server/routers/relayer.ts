import { TRPCError } from '@trpc/server';
import { env } from 'config/env/server';
import { providers, Wallet } from 'ethers';
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

const provider = new providers.JsonRpcProvider(env.RPC_URL);
const wallet = new Wallet(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', // test address for local
  provider,
);

const DOMAIN_SELECTOR_HASH =
  '0x945494529cc799d5423e33fc3fe2dd3cf98063fe93e6c14af49f6f8c17a571ee';
const TYPE_HASH =
  '0x2510fc5e187085770200b027d9f2cc4b930768f3b2bd81daafb71ffeb53d21c4';

const http = axios.create({
  baseURL: 'https://api.starton.io/v2',
  headers: {
    'x-api-key': 'EvfD7PJGEDIT4VCCVSZ16qREwPeNVQ6H',
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
        functionName: 'execute(tuple,bytes32,bytes32,bytes,bytes)',
        signerWallet: '0x9297108ceeE8b631B3De85486DB4Dd5fEfE20647', // test wallet
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
      const tx = await forwarder.execute(
        request,
        DOMAIN_SELECTOR_HASH,
        TYPE_HASH,
        '0x',
        signature,
        { gasLimit },
      );

      return { txHash: tx.hash };
    }

    const tx = await startonRelayer([
      request,
      DOMAIN_SELECTOR_HASH,
      TYPE_HASH,
      '0x',
      signature,
    ]);

    return { txHash: tx.transactionHash };
  },
});
