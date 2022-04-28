/**
 * TODO: use environnement variables
 */

const NextAuth = {
  popup: true,
  endpoint: 'http://localhost:5000/auth',
  strategies: {
    google: {
      clientId:
        '481747438343-bb09iaqu9de9db4pbvq5nthphf6bnbpd.apps.googleusercontent.com',
      redirectUri: 'http://localhost:3000/',
    },
    facebook: {
      clientId: '1565875930465432',
      redirectUri: 'http://localhost:3000/',
    },
  },
};

export default NextAuth;
