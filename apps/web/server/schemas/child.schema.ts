import { z } from 'zod';

export const ChildSchema = {
  inviteParent: z.object({
    email: z.string().email('Email is invalid'),
  }),
};
