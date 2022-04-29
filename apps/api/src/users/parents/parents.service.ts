import { NestAuthUser } from '@lib/nest-auth';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthService } from 'src/auth/jwt/jwt-auth.service';
import { LocalSigninDto } from 'src/auth/local/dto/local-signin.dto';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChildrenDto } from './dto/create-children.dto';
import { ParentSignupDto } from './dto/parent-signup.dto';

@Injectable()
export class ParentsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private jwtAuthService: JwtAuthService,
    private configService: ConfigService,
  ) {}

  getParent(userId: string) {
    return this.prisma.userParent.findUnique({
      where: {
        id: userId,
      },
    });
  }

  /**
   * Method used to create the user for the parents (local)
   * It will also send a confirmation email
   * ! we need a token here to make sure it's only for the correct user
   * ! crypt the password
   * @param data - Object with the parent's infos
   * @returns
   */

  async create(data: ParentSignupDto, verification = true) {
    const user = await this.prisma.userParent.upsert({
      where: {
        email: data.email,
      },
      create: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        emailVerified: verification ? null : new Date(),
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
      update: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        emailVerified: verification ? null : new Date(),
        account: {
          update: {
            password: data.password,
          },
        },
      },
    });

    if (verification) {
      const confirmationToken =
        this.jwtAuthService.generateEmailConfirmationToken(user.email);
      const url = `${this.configService.get(
        'NEXT_PUBLIC_URL',
      )}/?token=${confirmationToken}`;
      await this.emailService.sendConfirmationEmail(user, url);
    }

    return user;
  }

  /**
   * Method used to create the user for the parents (OAuth2)
   * ! a provider email can maybe not be verified ?
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
        emailVerified: new Date(),
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

  async getParentChildren(userId: string) {
    return this.prisma.userChild.findMany({
      where: {
        userParentId: userId,
      },
    });
  }

  /**
   * ! What to do if a child with the same email is pending ?
   *
   * @param parentId id of the parent
   * @param data object containing data to create the child
   * @returns
   */

  async createChildrenFromParent(parentId: string, data: CreateChildrenDto) {
    const user = await this.prisma.userChild.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        userParent: {
          connect: {
            id: parentId,
          },
        },
      },
    });
    return user;
  }
}
