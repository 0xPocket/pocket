import { z } from 'zod';

export const AuthSchema = {
  onboard: z.object({
    name: z.string(),
    email: z.string().email(),
  }),
};
