import { TRPCError } from '@trpc/server';
import { env } from 'config/env/server';
import { BigNumber, Contract, ethers, providers, Wallet } from 'ethers';
import { Forwarder__factory } from 'pocket-contract/typechain-types';
import { z } from 'zod';
import { createProtectedRouter } from '../createRouter';

// prettier-ignore
export const CustomForwarderAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"domainSeparator","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"domainValue","type":"bytes"}],"name":"DomainRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"typeHash","type":"bytes32"},{"indexed":false,"internalType":"string","name":"typeStr","type":"string"}],"name":"RequestTypeRegistered","type":"event"},{"inputs":[],"name":"EIP712_DOMAIN_TYPE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"GENERIC_PARAMS","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"gas","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"validUntil","type":"uint256"}],"internalType":"struct IForwarder.ForwardRequest","name":"req","type":"tuple"},{"internalType":"bytes32","name":"requestTypeHash","type":"bytes32"},{"internalType":"bytes","name":"suffixData","type":"bytes"}],"name":"_getEncoded","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"domains","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"gas","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"validUntil","type":"uint256"}],"internalType":"struct IForwarder.ForwardRequest","name":"req","type":"tuple"},{"internalType":"bytes32","name":"domainSeparator","type":"bytes32"},{"internalType":"bytes32","name":"requestTypeHash","type":"bytes32"},{"internalType":"bytes","name":"suffixData","type":"bytes"},{"internalType":"bytes","name":"sig","type":"bytes"}],"name":"execute","outputs":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"ret","type":"bytes"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"}],"name":"getNonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"version","type":"string"}],"name":"registerDomainSeparator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"typeName","type":"string"},{"internalType":"string","name":"typeSuffix","type":"string"}],"name":"registerRequestType","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"typeHashes","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"gas","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"validUntil","type":"uint256"}],"internalType":"struct IForwarder.ForwardRequest","name":"req","type":"tuple"},{"internalType":"bytes32","name":"domainSeparator","type":"bytes32"},{"internalType":"bytes32","name":"requestTypeHash","type":"bytes32"},{"internalType":"bytes","name":"suffixData","type":"bytes"},{"internalType":"bytes","name":"sig","type":"bytes"}],"name":"verify","outputs":[],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}] as const;

const whitelist = [process.env.NEXT_PUBLIC_CONTRACT_ADDRESS];
const ForwarderAddress = env.TRUSTED_FORWARDER;
const provider = new providers.JsonRpcProvider(env.RPC_URL);
const wallet = new Wallet(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  provider,
);

export const relayerRouter = createProtectedRouter().mutation('relay', {
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
  }),
  resolve: async ({ input }) => {
    const { request, signature } = input;

    const accepts = !whitelist || whitelist.includes(request.to);

    if (!accepts)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Request declined.',
      });

    const forwarder = Forwarder__factory.connect(ForwarderAddress, wallet);

    console.log('test');

    console.log(request);
    console.log(signature);

    console.log(
      'yoyo',
      ethers.utils.hexZeroPad(ethers.utils.toUtf8Bytes('guillaume'), 32),
    );
    //Validate request on the forwarder contract
    const valid = await forwarder.verify(
      request,
      '0x7ee6eca3d471bf6eb923e3af865444fe8a3a8c9ef79c43e326c28c7be7648cdc',
      '0x2510fc5e187085770200b027d9f2cc4b930768f3b2bd81daafb71ffeb53d21c4',
      '0x',
      signature,
    );
    console.log('le valid: ', valid);
    return true;
    if (!valid) throw new Error(`Invalid request`);

    // // Send meta-tx through relayer to the forwarder contract
    const gasLimit = (request.gas + 50000).toString();
    const tx = await forwarder.execute(
      request,
      '0x7ee6eca3d471bf6eb923e3af865444fe8a3a8c9ef79c43e326c28c7be7648cdc',
      '0x2510fc5e187085770200b027d9f2cc4b930768f3b2bd81daafb71ffeb53d21c4',
      ethers.utils.hexZeroPad(ethers.utils.toUtf8Bytes('0'), 32),
      signature,
      { gasLimit },
    );

    return { txHash: tx.hash };
  },
});
