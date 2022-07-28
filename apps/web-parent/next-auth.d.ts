import type { DefaultSession } from 'next-auth';

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
}
