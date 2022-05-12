const NextAuth = {
  popup: true,
  endpoint: 'http://localhost:3000/api/auth',
  session: {
    logout: 'http://localhost:3000/api/auth/logout',
  },
  strategies: {
    google: {
      clientId: process.env.NEXT_PUBLIC_OAUTH_GOOGLE_ID,
      redirectUri: process.env.NEXT_PUBLIC_OAUTH_GOOGLE_REDIRECT_URL,
    },
    facebook: {
      clientId: process.env.NEXT_PUBLIC_OAUTH_FACEBOOK_ID,
      redirectUri: process.env.NEXT_PUBLIC_OAUTH_FACEBOOK_REDIRECT_URL,
    },
    local: {},
  },
};

export default NextAuth;
