import { z } from "zod";

export const UserSchema = {
  onboard: z.object({
    name: z.string(),
    email: z.string().email(),
  }),
};
