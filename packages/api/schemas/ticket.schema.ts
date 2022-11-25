import { z } from 'zod';

export const TicketSchema = {
  submit: z.object({
    fromURL: z.string(),
    subject: z.string().optional(),
    desc: z.string(),
  }),
};
