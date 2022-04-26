const NextAuth = {
  popup: true,
  endpoint: 'http://localhost:5000/auth',
  strategies: {
    githubb: {
      clientId: 'ea0c0484c5065e20d140',
    },
    facebook: {
      clientId: '1565875930465432',
      redirectUri: 'http://localhost:3000/',
    },
  },
};

export default NextAuth;
