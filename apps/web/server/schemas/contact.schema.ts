import { z } from 'zod';

export const ContactSchema = {
  submit: z.object({
    name: z.string(),
    email: z.string(),
    subject: z.string().optional(),
    desc: z.string(),
  }),
};
