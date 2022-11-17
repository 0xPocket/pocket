import NextAuth from 'next-auth';

import { getAuthOptions } from '@pocket/api/next-auth';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const authOptions = getAuthOptions(req);

  if (!Array.isArray(req.query.nextauth)) {
    res.status(400).send('Bad request');
    return;
  }

  const isDefaultSigninPage =
    req.method === 'GET' &&
    req.query.nextauth.find((value) => value === 'signin');

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    authOptions.providers = [];
  }

  return await NextAuth(req, res, authOptions);
}
