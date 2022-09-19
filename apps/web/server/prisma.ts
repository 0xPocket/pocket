/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
import { PrismaClient } from '@prisma/client';
import { env } from 'config/env/server';

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  prismaGlobal.prisma ||
  new PrismaClient({
    log: env.QUERY_DEBUG ? ['query', 'error', 'warn'] : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma;
}
