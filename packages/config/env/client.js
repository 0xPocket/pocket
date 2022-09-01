// @ts-check
const { clientEnv, clientSchema } = require("./schema");

const _clientEnv = clientSchema.safeParse(clientEnv);

const network = require("../network");

const formatErrors = (
  /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
  errors
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}\n`;
    })
    .filter(Boolean);

if (_clientEnv.success === false) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(_clientEnv.error.format())
  );
  throw new Error("Invalid environment variables");
}

/**
 * Validate that client-side environment variables are exposed to the client.
 */
for (let key of Object.keys(_clientEnv.data)) {
  if (!key.startsWith("NEXT_PUBLIC_")) {
    console.warn("❌ Invalid public environment variable name:", key);

    throw new Error("Invalid public environment variable name");
  }
}

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

module.exports = {
  env: {
    ..._clientEnv.data,
    ...network[_clientEnv.data.NEXT_PUBLIC_NETWORK],
    APP_URL: getBaseUrl(),
  },
  formatErrors,
};
