import { sendEmailWrapper } from "@pocket/emails";
import { TRPCError } from "@trpc/server";
import { env } from "config/env/server";
import { ChildSchema } from "../../schemas";
import { childProcedure } from "../procedures";
import {
  generateLinkParams,
  generateRegisterParams,
} from "../services/registerInvite";
import { t } from "../trpc";

export const childRouter = t.router({
  getParent: childProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findFirst({
      where: {
        type: "Parent",
        parent: {
          children: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        address: true,
      },
    });
  }),

  inviteParent: childProcedure
    .input(ChildSchema.inviteParent)
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          child: true,
        },
      });

      if (user?.child?.parentUserId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You already have a parent.",
        });
      }

      const existingParent = await ctx.prisma.user.findFirst({
        where: {
          email: {
            equals: input.email,
            mode: "insensitive",
          },
        },
        include: {
          child: true,
        },
      });

      if (existingParent) {
        const params = await generateLinkParams({
          childId: ctx.session.user.id,
          parentId: existingParent.id,
        });

        await sendEmailWrapper({
          to: existingParent.email,
          template: "link_invitation",
          subject: "Your child wants to be part of your account !",
          props: {
            name: existingParent.name,
            link: `${env.APP_URL}/link-account?${params}`,
            from: "Child",
            fromName: ctx.session.user.name,
          },
        });

        return true;
      }

      const params = await generateRegisterParams(
        {
          childId: ctx.session.user.id,
          email: input.email,
        },
        "Parent"
      );

      await sendEmailWrapper({
        to: input.email,
        template: "register_invitation",
        props: {
          link: `${env.APP_URL}/register-invite?${params}`,
          from: "Child",
          fromName: ctx.session.user.name,
        },
      });

      return true;
    }),
});
