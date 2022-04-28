import { NestAuthUser } from '@lib/nest-auth';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { LocalSigninDto } from 'src/auth/local/dto/local-signin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ParentSignupDto } from './dto/parent-signup.dto';

@Injectable()
export class ParentsService {
  constructor(private prisma: PrismaService) {}

  getParent(userId: string) {
    return this.prisma.userParent.findUnique({
      where: {
        id: userId,
      },
    });
  }

  /**
   * Method used to create the user for the parents (local)
   * @param data - Object with the parent's infos
   * @returns
   */

  async create(data: ParentSignupDto) {
    const user = await this.prisma.userParent.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        account: {
          create: {
            type: 'credentials',
            provider: 'local',
            password: data.password,
          },
        },
        wallet: {
          create: {
            publicKey: 'test',
          },
        },
      },
    });
    return user;
  }

  /**
   * Method used to create the user for the parents (OAuth2)
   * @param data - Object with the parent's infos
   * @param providerId - OAuth2 provider's strategy id
   * @returns
   */

  async createOrGetOAuth(data: NestAuthUser, providerId: string) {
    const user = await this.prisma.userParent.findUnique({
      where: {
        email: data.email,
      },
      include: {
        account: true,
      },
    });

    if (user) {
      if (user.account.provider !== providerId) {
        throw new BadRequestException(
          `You must connect your account with ${user.account.provider}`,
        );
      }
    }

    return this.prisma.userParent.upsert({
      where: {
        email: data.email,
      },
      create: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        account: {
          create: {
            type: 'oauth',
            provider: providerId,
            providerAccountId: data.id,
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

  async signInParentLocal(data: LocalSigninDto, providerId: string) {
    const user = await this.prisma.userParent.findUnique({
      where: {
        email: data.email,
      },
      include: {
        account: true,
      },
    });

    if (!user) {
      throw new BadRequestException("This user doesn't exists");
    }

    const account = await this.prisma.account.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (account && account.provider !== providerId) {
      throw new BadRequestException(
        `You must connect your account with ${account.provider}`,
      );
    }

    if (account.password !== data.password) {
      throw new ForbiddenException('Invalid password');
    }

    return user;
  }
}
