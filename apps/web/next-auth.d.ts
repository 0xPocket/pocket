import type { UserType } from '@prisma/client';
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  type DefaultSessionUser = NonNullable<DefaultSession['user']>;
  type CustomSessionUser = DefaultSessionUser & {
    id: string;
    address: string | undefined;
    type: UserType;
  };
  interface Session {
    user: CustomSessionUser;
  }

  interface User {
    type: UserType;
    address: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    address: string | undefined;
    type: UserType;
  }
}
