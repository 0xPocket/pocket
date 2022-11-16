import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { verifyInvite } from "../services/verifyInvite";
import { t } from "../trpc";
import * as requestIp from "request-ip";
import { verifyDidToken } from "../services/magic";
import { grantPktToken } from "../services/grantPktToken";
import { env } from "config/env/server";
import { SiweMessage } from "siwe";
import { sendCodeVerificationEmail } from "../services/emailVerification";

export const registerRouter = t.router({
  magic: t.procedure
    .input(
      z.object({
        invite: z
          .object({
            token: z.string(),
            childId: z.string(),
          })
          .optional(),
        name: z.string(),
        didToken: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userMetadata = await verifyDidToken(input.didToken);

      if (!userMetadata) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid DID token.",
        });
      }

      const existingUser = await ctx.prisma.user.findFirst({
        where: {
          email: {
            equals: userMetadata.email,
            mode: "insensitive",
          },
        },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This user already exists",
        });
      }

      let validInvite: typeof input.invite = undefined;

      if (input.invite) {
        await verifyInvite({
          token: input.invite.token,
          identifier: JSON.stringify({
            childId: input.invite.childId,
            email: userMetadata.email,
          }),
        });

        validInvite = input.invite;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ip = requestIp.getClientIp(ctx.req as any);

      if (env.NETWORK_KEY === "polygon-mumbai") {
        await grantPktToken(userMetadata.address);
      }

      const newUser = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: userMetadata.email,
          emailVerified: new Date(),
          address: userMetadata.address,
          ipAddress: ip,
          type: "Parent",
          accountType: "Magic",
          parent: {
            create: {},
          },
        },
      });

      ctx.log.info("new register with magic", {
        email: userMetadata.email,
        address: userMetadata.address,
      });

      if (validInvite) {
        await ctx.prisma.child.update({
          where: { userId: validInvite.childId },
          data: {
            parentUserId: newUser.id,
          },
        });

        const child = await ctx.prisma.user.findUnique({
          where: { id: validInvite.childId },
        });

        ctx.log.info("child linked", {
          parentEmail: newUser.email,
          childEmail: child?.email,
        });

        return {
          verifyEmail: false,
        };
      }

      return {
        verifyEmail: false,
      };
    }),

  ethereum: t.procedure
    .input(
      z.object({
        invite: z
          .object({
            token: z.string(),
            childId: z.string().optional(),
            parentId: z.string().optional(),
          })
          .optional(),
        name: z.string(),
        email: z.string().email(),
        message: z.string(),
        signature: z.string(),
        type: z.enum(["Parent", "Child"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const siwe = new SiweMessage(JSON.parse(input.message || "{}"));
      const valid = await siwe.validate(input.signature || "");

      if (!valid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid signature",
        });
      }

      const existingUser = await ctx.prisma.user.findFirst({
        where: {
          OR: [
            {
              email: {
                equals: input.email,
                mode: "insensitive",
              },
            },
            { address: { equals: siwe.address, mode: "insensitive" } },
          ],
        },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This user already exists",
        });
      }

      let validInvite: typeof input.invite = undefined;

      if (input.invite) {
        await verifyInvite({
          token: input.invite.token,
          identifier: input.invite.childId
            ? JSON.stringify({
                childId: input.invite.childId,
                email: input.email,
              })
            : JSON.stringify({
                parentId: input.invite.parentId,
                email: input.email,
              }),
        });

        validInvite = input.invite;
      }

      const ip = requestIp.getClientIp(ctx.req as any);

      if (env.NETWORK_KEY === "polygon-mumbai") {
        await grantPktToken(siwe.address);
      }

      const newUser = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          address: siwe.address,
          type: input.type,
          ipAddress: ip,
          accountType: "Ethereum",
          parent:
            input.type === "Parent"
              ? {
                  create: {},
                }
              : undefined,
          child:
            input.type === "Child"
              ? {
                  create: {},
                }
              : undefined,
        },
      });

      ctx.log.info("new register with ethereum", {
        email: newUser.email,
        address: newUser.address,
        type: newUser.type,
      });

      if (validInvite) {
        const childId = validInvite.childId ? validInvite.childId : newUser.id;
        const parentId = validInvite.childId
          ? newUser.id
          : validInvite.parentId;
        const inviteFrom = validInvite.childId ? "Child" : "Parent";

        await ctx.prisma.child.update({
          where: { userId: childId },
          data: {
            parentUserId: parentId,
          },
        });

        if (inviteFrom === "Parent") {
          const childConfig = await ctx.prisma.pendingChild.delete({
            where: {
              email: input.email,
            },
          });

          await ctx.prisma.user.update({
            where: { id: childId },
            data: {
              name: childConfig.name,
              emailVerified: new Date(),
            },
          });
        } else {
          await ctx.prisma.user.update({
            where: { id: newUser.id },
            data: {
              emailVerified: new Date(),
            },
          });
        }

        return {
          verifyEmail: false,
        };
      }

      await sendCodeVerificationEmail({
        email: newUser.email,
        name: newUser.name,
      });

      return {
        verifyEmail: true,
      };
    }),
});
