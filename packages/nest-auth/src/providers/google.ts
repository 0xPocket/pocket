import { OAuthUserConfig, Provider } from ".";

export default function GoogleProvider(
  options: OAuthUserConfig<any>
): Provider {
  return {
    id: "google",
    name: "Google",
    type: "oauth",
    authorization: "https://accounts.google.com/o/oauth2/v2/auth",
    options,
  };
}
