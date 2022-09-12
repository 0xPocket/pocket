/**
 * This file contains the root router of your tRPC-backend
 */
import superjson from 'superjson';

import { createRouter } from '../createRouter';
import { authRouter } from './auth';
import { childRouter } from './child';
import { emailRouter } from './email';
import { parentRouter } from './parent';
import { testRouter } from './test';
import { tokenRouter } from './token';

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
  /**
   * Add data transformers
   * @link https://trpc.io/docs/data-transformers
   */
  .transformer(superjson)
  /**
   * Optionally do custom error (type safe!) formatting
   * @link https://trpc.io/docs/error-formatting
   */
  // .formatError(({ shape, error }) => { })
  .merge('email.', emailRouter)
  .merge('auth.', authRouter)
  .merge('parent.', parentRouter)
  .merge('child.', childRouter)
  .merge('token.', tokenRouter)
  .merge('test.', testRouter);

export type AppRouter = typeof appRouter;
