import NextAuth from 'next-auth';

import { authOptions } from '../../../server/next-auth';

export default NextAuth(authOptions);
