import { OAuth2Provider } from "./types";
import { merge } from "./utils";

export interface FacebookProfile {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  picture: {
    data: {
      url: string;
    };
  };
}

export function facebook<P extends FacebookProfile>(
  options: Partial<OAuth2Provider<P>>
) {
  const DEFAULTS: typeof options = {
    type: "oauth",
    id: "facebook",
    name: "Facebook",
    endpoints: {
      authorization: "https://www.facebook.com/v11.0/dialog/oauth",
      token: "https://graph.facebook.com/oauth/access_token",
      userInfo: "https://graph.facebook.com/me",
    },
    params: {
      fields: "id,name,picture,email",
    },
    scope: ["email"],
    profile: (profile) => {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.picture.data.url,
      };
    },
  };

  const strategy = merge(DEFAULTS, options);

  return strategy;
}
