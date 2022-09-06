import { z } from 'zod';

export const ParentSchema = {
  createChild: z.object({
    name: z.string().min(4, 'Name must be at least 4 characters'),
    email: z.string().email('Email is invalid'),
  }),
};
