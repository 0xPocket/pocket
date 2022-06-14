export const FACEBOOK_OAUTH_CONFIG = {
  clientId: process.env.OAUTH_FACEBOOK_ID,
  secretId: process.env.OAUTH_FACEBOOK_SECRET,
  redirectUri: process.env.OAUTH_FACEBOOK_REDIRECT_URL,
  params: {
    fields: 'id,email,name,first_name,last_name',
  },
};

export const GOOGLE_OAUTH_CONFIG = {
  clientId: process.env.OAUTH_GOOGLE_ID,
  secretId: process.env.OAUTH_GOOGLE_SECRET,
  redirectUri: process.env.OAUTH_GOOGLE_REDIRECT_URL,
};
