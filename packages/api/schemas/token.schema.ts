import { z } from "zod";

export const TokenSchema = {
  report: z.object({
    address: z.string().transform((address) => address.toLowerCase()),
  }),
};
