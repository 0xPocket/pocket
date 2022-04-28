import { OAuth2Provider } from "./types";
import { merge } from "./utils";

export interface GoogleProfile {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
  picture: string;
}

export function google<P extends GoogleProfile>(
  options: Partial<OAuth2Provider<P>>
) {
  const DEFAULTS: typeof options = {
    type: "oauth",
    id: "google",
    name: "Google",
    endpoints: {
      authorization: "https://accounts.google.com/o/oauth2/v2/auth",
      token: "https://oauth2.googleapis.com/token",
      userInfo: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    scope: ["openid", "profile", "email"],
    profile: (profile) => {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      };
    },
  };

  const strategy = merge(DEFAULTS, options);

  return strategy;
}
