// @ts-check
/**
 * This file is included in `/next.config.js` which ensures the app isn't built with invalid env vars.
 * It has to be a `.js`-file to be imported there.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const { z } = require('zod');

/*eslint sort-keys: "error"*/
const envSchema = z.object({
  // DATABASE_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REFRESH_TOKEN: z.string(),
  JWT_EMAIL_SECRET: z.string().optional(),
  MAIL_USER: z.string().email(),
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXT_PUBLIC_CONTRACT_ADDRESS: z.string(),
  NEXT_PUBLIC_RPC_ENDPOINT: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  POCKET_PRIVATE_KEY: z.string(),
  QUERY_DEBUG: z.string().optional(),
  VERCEL_URL: z.string().optional(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error(
    '❌ Invalid environment variables:',
    JSON.stringify(env.error.format(), null, 4),
  );
  process.exit(1);
}

module.exports.env = env.data;
