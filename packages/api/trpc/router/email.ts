import { sendEmailWrapper } from "@pocket/emails";
import { TRPCError } from "@trpc/server";
import { env } from "config/env/server";
import { z } from "zod";
import { parentProcedure, protectedProcedure } from "../procedures";
import { sendVerificationEmail } from "../services/emailVerification";
import { generateRegisterParams } from "../services/registerInvite";
import { verifyInvite } from "../services/verifyInvite";
import { t } from "../trpc";

export const emailRouter = t.router({
  verifyEmail: t.procedure
    .input(
      z.object({
        email: z.string(),
        token: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await verifyInvite({
        token: input.token,
        identifier: input.email,
      });

      const user = await ctx.prisma.user.update({
        where: {
          email: input.email,
        },
        data: {
          emailVerified: new Date(),
        },
      });

      return user;
    }),

  resendVerificationEmail: t.procedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: {
            equals: input.email,
            mode: "insensitive",
          },
        },
      });

      if (!user || user.emailVerified) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }

      return sendVerificationEmail({
        email: user.email,
        name: user.name,
      });
    }),

  // TODO: adapt for child too ?
  resendInviteEmail: parentProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const childConfig = await ctx.prisma.pendingChild.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!childConfig || childConfig.parentUserId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const params = await generateRegisterParams(
        {
          parentId: ctx.session.user.id,
          email: childConfig.email,
        },
        "Child"
      );

      await sendEmailWrapper({
        to: childConfig.email,
        template: "register_invitation",
        props: {
          link: `${env.APP_URL}/register-invite?${params}`,
          from: "Parent",
          name: childConfig.name,
          fromName: ctx.session.user.name,
        },
      });
    }),

  linkAccount: protectedProcedure
    .input(
      z.object({
        token: z.string(),
        parentId: z.string(),
        childId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const parentId =
        ctx.session.user.type === "Parent"
          ? ctx.session.user.id
          : input.parentId;
      const childId =
        ctx.session.user.type === "Child" ? ctx.session.user.id : input.childId;

      await verifyInvite({
        token: input.token,
        identifier: JSON.stringify({
          childId,
          parentId,
        }),
      });

      await ctx.prisma.child.update({
        where: {
          userId: childId,
        },
        data: {
          parent: {
            connect: {
              userId: parentId,
            },
          },
        },
      });
    }),
});
