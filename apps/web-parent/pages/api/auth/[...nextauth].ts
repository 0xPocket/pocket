import NextAuth from 'next-auth';

import { authOptions } from '@lib/trpc/next-auth';

export default NextAuth(authOptions);
