// import { OAuthUserConfig, Provider } from ".";

import { OAuth2Provider } from "./types";
import { merge } from "./utils";

export function github(options: Partial<OAuth2Provider>) {
  const DEFAULTS: typeof options = {
    type: "oauth",
    id: "github",
    name: "GitHub",
    endpoints: {
      authorization: "https://github.com/login/oauth/authorize",
      token: "https://github.com/login/oauth/access_token",
      userInfo: "https://api.github.com/user",
    },
    scope: ["user", "user:email"],
  };

  const strategy = merge(DEFAULTS, options);

  return strategy;
}
