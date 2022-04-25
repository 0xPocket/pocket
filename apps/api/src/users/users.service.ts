import { Account, AuthType, TokenType, User, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  getOrCreateOAuthUser(user: Partial<User>, account: Partial<Account>) {
    const AccountsInput: Prisma.AccountCreateNestedManyWithoutUserInput = {
      connectOrCreate: {
        where: {
          provider_providerAccountId: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        },
        create: {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          token_type: TokenType.Bearer,
          type: AuthType.oauth,
        },
      },
    };

    return this.prisma.user.upsert({
      where: {
        email: user.email,
      },
      create: {
        name: user.name,
        email: user.email,
        accounts: AccountsInput,
      },
      update: {
        accounts: AccountsInput,
      },
    });
  }
}
