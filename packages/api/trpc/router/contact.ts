import { ContactSchema } from "../../schemas";
import { t } from "../trpc";

export const contactRouter = t.router({
  submit: t.procedure.input(ContactSchema.submit).mutation(({ input, ctx }) => {
    ctx.log.info("new form contact submitted");
    return ctx.prisma.contact.create({
      data: {
        ...input,
        userId: ctx.session?.user.id,
      },
    });
  }),
});
