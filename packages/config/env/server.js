// @ts-check

/**
 * This file is included in `/next.config.mjs` which ensures the app isn't built with invalid env vars.
 * It has to be a `.mjs`-file to be imported there.
 */
const { env: clientEnv, formatErrors } = require("./client");

const { serverSchema } = require("./schema");

const _serverEnv = serverSchema.safeParse(process.env);

if (_serverEnv.success === false) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(_serverEnv.error.format())
  );
  process.exit(1);
}

/**
 * Validate that server-side environment variables are not exposed to the client.
 */
for (let key of Object.keys(_serverEnv.data)) {
  if (key.startsWith("NEXT_PUBLIC_")) {
    console.warn("❌ You are exposing a server-side env-variable:", key);

    process.exit(1);
  }
}

const env = { ..._serverEnv.data, ...clientEnv };

module.exports = {
  env,
};
