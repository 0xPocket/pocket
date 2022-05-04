const NextAuth = {
  popup: true,
  endpoint: 'http://localhost:5000/auth',
  strategies: {
    google: {
      clientId: process.env.NEXT_PUBLIC_OAUTH_GOOGLE_ID,
      redirectUri: process.env.NEXT_PUBLIC_OAUTH_GOOGLE_REDIRECT_URL,
    },
    facebook: {
      clientId: process.env.NEXT_PUBLIC_OAUTH_FACEBOOK_ID,
      redirectUri: process.env.NEXT_PUBLIC_OAUTH_FACEBOOK_REDIRECT_URL,
    },
  },
};

export default NextAuth;
