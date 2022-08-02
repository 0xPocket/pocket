import type { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  type DefaultSessionUser = NonNullable<DefaultSession['user']>;
  type CustomSessionUser = DefaultSessionUser & {
    id: string;
    address: string | undefined;
    isNewUser: boolean;
    type: 'Parent' | 'Child';
  };
  interface Session {
    user: CustomSessionUser;
  }

  interface User {
    type: existingUser.type;
    isNewUser: existingUser.newUser;
    address: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    isNewUser: boolean;
    type: 'Parent' | 'Child';
  }
}
