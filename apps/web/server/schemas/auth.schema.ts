import { z } from 'zod';

export const AuthSchema = {
  onboard: z.object({
    name: z.string().min(1, 'Name cannot be empty'),
    email: z.string().email('Email is invalid'),
    terms: z.boolean({
      required_error: 'You must accept the terms',
    }),
    majority: z.boolean({
      required_error: 'You must be 18 years old',
    }),
  }),
};
