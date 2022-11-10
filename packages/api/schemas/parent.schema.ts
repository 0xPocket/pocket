import { z } from 'zod';

export const ParentSchema = {
  createChild: z.object({
    name: z
      .string()
      .min(1, 'Name cannot be empty')
      .max(15, 'Name cannot be longer than 15 characters'),
    email: z.string().email('Email is invalid'),
  }),
};
