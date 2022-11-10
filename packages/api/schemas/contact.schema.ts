import { z } from 'zod';

export const ContactSchema = {
  submit: z.object({
    name: z.string(),
    email: z.string().email(),
    subject: z.string(),
    desc: z.string(),
  }),
};
