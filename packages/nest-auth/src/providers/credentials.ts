import { CredentialsConfig } from "providers";

export default function Credentials(options: CredentialsConfig) {
  return {
    type: "credentials",
    ...options,
  };
}
