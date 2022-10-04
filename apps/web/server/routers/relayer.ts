import { TRPCError } from '@trpc/server';
import { env } from 'config/env/server';
import { ethers, providers, Wallet } from 'ethers';
import { ForwarderAbi, PocketFaucetAbi } from 'pocket-contract/abi';
import {
  Forwarder,
  Forwarder__factory,
  PocketFaucet__factory,
} from 'pocket-contract/typechain-types';
import { z } from 'zod';
import { createProtectedRouter } from '../createRouter';
import { getParsedEthersError } from '@enzoferey/ethers-error-parser';
import axios from 'axios';
import {
  DefenderRelayProvider,
  DefenderRelaySigner,
} from 'defender-relay-client/lib/ethers';
const provider = new providers.JsonRpcProvider(env.RPC_URL);
const wallet = new Wallet(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', // test address for local
  provider,
);

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

const startonRelayer = async (params: any) => {
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
    .then((res) => res.data)
    .catch((e) => console.log(e));
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
      env.DOMAIN_SELECTOR_HASH,
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
        env.DOMAIN_SELECTOR_HASH,
        TYPE_HASH,
        '0x',
        signature,
        { gasLimit },
      );

      return { txHash: tx.hash };
    }

    const defenderProvider = new DefenderRelayProvider({
      apiKey: '8zW5XQv8RS9Qqn8yWmDhgdCim8KNFD4q',
      apiSecret:
        '2DuoiEsQhEX3n74Ksp7FeoNNxor1DRGAYp5wdShdBLi7cZW5AuoQA2ANpcjxbBnP',
    });

    const signer = new DefenderRelaySigner(
      {
        apiKey: '8zW5XQv8RS9Qqn8yWmDhgdCim8KNFD4q',
        apiSecret:
          '2DuoiEsQhEX3n74Ksp7FeoNNxor1DRGAYp5wdShdBLi7cZW5AuoQA2ANpcjxbBnP',
      },
      defenderProvider,
      { speed: 'fast' },
    );

    const defenderForwarder = new ethers.Contract(
      env.TRUSTED_FORWARDER,
      ForwarderAbi,
      signer,
    );

    const tx = await defenderForwarder.execute(
      request,
      env.DOMAIN_SELECTOR_HASH,
      TYPE_HASH,
      '0x',
      signature,
    );

    return { txHash: tx.hash };
  },
});
