import { OAuthUserConfig, Provider } from ".";

export default function GitHubProvider(
  options: OAuthUserConfig<any>
): Provider {
  return {
    id: "github",
    name: "GitHub",
    type: "oauth",
    authorization:
      "https://github.com/login/oauth/authorize?scope=read:user+user:email",
    options,
  };
}
