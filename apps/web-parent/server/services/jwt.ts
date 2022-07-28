import { Prisma } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';
import { prisma } from '../prisma';

export function hashToken(token: string) {
  return createHash('sha256')
    .update(`${token}${process.env.JWT_EMAIL_SECRET}`)
    .digest('hex');
}

export function generateVerificationToken() {
  return randomBytes(32).toString('hex');
}

export function saveVerificationToken(
  data: Prisma.VerificationTokenCreateInput,
) {
  return prisma.verificationToken.create({
    data,
  });
}

export async function useVerificationToken(
  identifier_token: Prisma.VerificationTokenIdentifierTokenCompoundUniqueInput,
) {
  try {
    const token = await prisma.verificationToken.delete({
      where: { identifier_token },
    });

    return token;
  } catch (error) {
    if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2025')
      return null;
    throw error;
  }
}
