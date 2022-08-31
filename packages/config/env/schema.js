// @ts-check

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
const { z } = require("zod");

const serverSchema = z.object({
  JWT_EMAIL_SECRET: z.string().optional(),
  MAGIC_LINK_SECRET_KEY: z.string(),
  MAIL_USER: z.string().email(),
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  QUERY_DEBUG: z.string().optional(),
  SENDGRID_API_KEY: z.string(),
  VERCEL_URL: z.string().optional(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_DEBUG: z.string().optional(),
  NEXT_PUBLIC_NETWORK: z.enum([
    "polygon-mainnet",
    "polygon-mumbai",
    "eth-rinkeby",
    "localhost",
  ]),
  NEXT_PUBLIC_CONTRACT_ADDRESS: z.string(),
  NEXT_PUBLIC_COVALENT_KEY: z.string(),
  NEXT_PUBLIC_MAGIC_LINK_PUBLIC_KEY: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
const clientEnv = {
  NEXT_PUBLIC_DEBUG: process.env.NEXT_PUBLIC_DEBUG,
  // @ts-ignore
  NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK,
  NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  NEXT_PUBLIC_COVALENT_KEY: process.env.NEXT_PUBLIC_COVALENT_KEY,
  NEXT_PUBLIC_MAGIC_LINK_PUBLIC_KEY:
    process.env.NEXT_PUBLIC_MAGIC_LINK_PUBLIC_KEY,
};

module.exports = {
  serverSchema,
  clientSchema,
  clientEnv,
};
