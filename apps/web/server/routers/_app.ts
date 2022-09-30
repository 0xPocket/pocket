/**
 * This file contains the root router of your tRPC-backend
 */
import superjson from 'superjson';

import { createRouter } from '../createRouter';
import { authRouter } from './auth';
import { childRouter } from './child';
import { contactRouter } from './contact';
import { emailRouter } from './email';
import { parentRouter } from './parent';
import { ticketRouter } from './ticket';
import { testRouter } from './test';
import { tokenRouter } from './token';
import { relayerRouter } from './relayer';
import { registerRouter } from './register';
import { connectRouter } from './connect';

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
  .merge('connect.', connectRouter)
  .merge('register.', registerRouter)
  .merge('parent.', parentRouter)
  .merge('child.', childRouter)
  .merge('token.', tokenRouter)
  .merge('contact.', contactRouter)
  .merge('ticket.', ticketRouter)
  .merge('relayer.', relayerRouter)
  .merge('test.', testRouter);

export type AppRouter = typeof appRouter;
