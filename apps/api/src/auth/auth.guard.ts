import { NestAuthData } from '@lib/nest-auth/nest/types';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async createOrGetUser(data: NestAuthData) {
    const user = await this.prisma.userParent.findUnique({
      where: {
        email: data.profile.email,
      },
    });

    if (user) {
      const account = await this.prisma.account.findUnique({
        where: {
          userId: user.id,
        },
      });

      if (account && account.provider !== data.provider) {
        throw new BadRequestException(
          `You must connect your account with ${account.provider}`,
        );
      }
    }

    return this.prisma.userParent.upsert({
      where: {
        email: data.profile.email,
      },
      create: {
        firstName: data.profile.name,
        lastName: data.profile.name,
        email: data.profile.email,
        account: {
          create: {
            type: 'oauth',
            provider: data.provider,
            providerAccountId: data.profile.id,
          },
        },
        wallet: {
          create: {
            publicKey: 'public_key',
            privateKey: 'asgfagdag',
          },
        },
      },
      update: {},
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const data: NestAuthData = request.nest_auth;

    const user = await this.createOrGetUser(data);

    request.user = user;

    return true;
  }
}
