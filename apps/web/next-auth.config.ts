import Credentials from '@lib/nest-auth/providers/credentials';

const NextAuth = {
  popup: true,
  authEndpoint: 'http://localhost:5000/auth',
  providers: [
    // OAuth authentication providers
    Credentials({
      id: 'local',
      name: 'Local Signin',
    }),
  ],
};

export default NextAuth;
