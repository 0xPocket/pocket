// import { OAuthUserConfig, Provider } from ".";

import { OAuth2Provider } from "./types";
import { merge } from "./utils";

export function facebook(options: Partial<OAuth2Provider>) {
  const DEFAULTS: typeof options = {
    type: "oauth",
    id: "facebook",
    name: "Facebook",
    endpoints: {
      authorization: "https://www.facebook.com/v11.0/dialog/oauth",
      token: "https://graph.facebook.com/oauth/access_token",
      userInfo: "https://graph.facebook.com/me?fields=id,name,email,picture",
    },
    scope: ["email"],
  };

  const strategy = merge(DEFAULTS, options);

  return strategy;
}
