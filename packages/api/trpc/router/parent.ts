import { sendEmailWrapper } from "@pocket/emails";
import { TRPCError } from "@trpc/server";
import { env } from "config/env/server";
import { ParentSchema } from "../../schemas";
import { parentProcedure, parentRelatedProcedure } from "../procedures";
import {
  generateLinkParams,
  generateRegisterParams,
} from "../services/registerInvite";
import { t } from "../trpc";

export const parentRouter = t.router({
  children: parentProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      where: {
        type: "Child",
        child: {
          parentUserId: ctx.session.user.id,
        },
      },
      include: {
        child: true,
      },
    });
  }),

  pendingChildren: parentProcedure.query(({ ctx }) => {
    return ctx.prisma.pendingChild.findMany({
      where: {
        parentUserId: ctx.session.user.id,
      },
    });
  }),

  createChild: parentProcedure
    .input(ParentSchema.createChild)
    .mutation(async ({ ctx, input }) => {
      const [existingChild, pendingChild] = await ctx.prisma.$transaction([
        ctx.prisma.user.findFirst({
          where: {
            email: {
              equals: input.email,
              mode: "insensitive",
            },
          },
          include: {
            child: true,
          },
        }),
        ctx.prisma.pendingChild.findFirst({
          where: {
            email: {
              equals: input.email,
              mode: "insensitive",
            },
          },
        }),
      ]);

      if (pendingChild) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "A user with that email already exists",
        });
      }

      if (
        existingChild &&
        (existingChild.type === "Parent" || existingChild?.child?.parentUserId)
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "This user is a parent account or already have a parent associated to it.",
        });
      }

      if (existingChild) {
        const params = await generateLinkParams({
          childId: existingChild.id,
          parentId: ctx.session.user.id,
        });

        await sendEmailWrapper({
          to: existingChild.email,
          template: "link_invitation",
          subject: "Your parent wants you to be part of his account !",
          props: {
            name: existingChild.name,
            link: `${env.APP_URL}/link-account?${params}`,
            from: "Parent",
            fromName: ctx.session.user.name,
          },
        });

        return true;
      }

      const childConfig = await ctx.prisma.pendingChild.create({
        data: {
          name: input.name,
          email: input.email,
          parentUserId: ctx.session.user.id,
        },
      });

      const params = await generateRegisterParams(
        {
          parentId: ctx.session.user.id,
          email: input.email,
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

      ctx.log.info("new child created", { childConfig });

      return true;
    }),

  childByAddress: parentRelatedProcedure.query(({ ctx }) => {
    return ctx.child;
  }),
});
