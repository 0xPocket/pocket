import { z } from "zod";
import { t } from "../trpc";
import { env } from "config/env/server";
import {
  Forwarder__factory,
  PocketFaucet__factory,
} from "pocket-contract/typechain-types";
import { TRPCError } from "@trpc/server";
import { _TypedDataEncoder } from "ethers/lib/utils";
import { PocketFaucetAbi } from "pocket-contract/abi";
import { getParsedEthersError } from "@enzoferey/ethers-error-parser";
import { startonRelayer } from "../services/starton";
import {
  DOMAIN_SELECTOR_HASH,
  relayerSigner,
  TYPE_HASH,
} from "../services/ethereum";
import { protectedProcedure } from "../procedures";

export const relayerRouter = t.router({
  forward: protectedProcedure
    .input(
      z.object({
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
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { request, signature } = input;

      const accepts = request.to === env.NEXT_PUBLIC_CONTRACT_ADDRESS;

      if (!accepts)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Request declined.",
        });

      const forwarder = Forwarder__factory.connect(
        env.TRUSTED_FORWARDER,
        relayerSigner
      );

      const gasLimit = (request.gas + 300000).toString();

      const paramsTuple = [
        request,
        DOMAIN_SELECTOR_HASH,
        TYPE_HASH,
        "0x",
        signature,
      ] as const;

      const staticCall = await forwarder.callStatic.execute(...paramsTuple, {
        gasLimit,
      });

      if (!staticCall.success) {
        ctx.log.error("call static failed", { ret: staticCall });
        try {
          PocketFaucet__factory.getInterface(
            PocketFaucetAbi
          ).decodeFunctionResult(input.functionName, staticCall.ret);
        } catch (e) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const error = getParsedEthersError(e as any);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.context,
          });
        }
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error during the transaction",
        });
      }

      if (env.NODE_ENV === "development") {
        const tx = await forwarder.execute(...paramsTuple, { gasLimit });

        return { txHash: tx.hash };
      }

      try {
        const tx = await startonRelayer([...paramsTuple]);

        ctx.log.debug("successfully relayed tx", {
          txHash: tx.transactionHash,
        });

        return { txHash: tx.transactionHash };
      } catch (e) {
        ctx.log.error("error relaying tx");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error relaying transaction, please reach us.",
        });
      }
    }),
});
