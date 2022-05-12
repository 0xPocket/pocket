import { CredentialsProvider } from "./types";
import { merge } from "./utils";

export function local(options: Partial<CredentialsProvider>) {
  const DEFAULTS: typeof options = {
    type: "credentials",
    id: "local",
    name: "Local",
    endpoints: {
      token: "",
    },
  };

  const strategy = merge(DEFAULTS, options);

  return strategy;
}
