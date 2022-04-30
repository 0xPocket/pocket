import { NestAuthUser } from '@lib/nest-auth';
import { UserChild, UserParent } from '@lib/prisma';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
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

  // LOCAL SIGNUP/SIGNIN

  async localSignup(data: ParentSignupDto, verification = true) {
    const user = await this.create(data, verification);
    if (verification) {
      await this.sendParentConfirmationEmail(user);
    }
    return user;
  }

  async localSignin(data: LocalSigninDto, providerId: string) {
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

    if (!user.emailVerified) {
      throw new ForbiddenException(
        'You must verify your email before logging in',
      );
    }

    if (user.account && user.account.provider !== providerId) {
      throw new BadRequestException(
        `You must connect with the provider associated with your account`,
      );
    }

    if (!(await compare(data.password, user.account.password))) {
      throw new ForbiddenException('Invalid password');
    }

    return user;
  }

  async sendParentConfirmationEmail(user: UserParent) {
    const confirmationToken =
      this.jwtAuthService.generateEmailConfirmationToken(user.email);
    const url = `${this.configService.get(
      'NEXT_PUBLIC_URL',
    )}/?token=${confirmationToken}`;
    return this.emailService.sendConfirmationEmail(user, url);
  }

  confirmEmail(token: string) {
    const payload = this.jwtAuthService.verifyEmailConfirmationToken(token);

    if (!payload)
      throw new BadRequestException('Verification link is invalid or expired');

    return this.prisma.userParent.update({
      where: {
        email: payload.email,
      },
      data: {
        emailVerified: new Date(),
      },
    });
  }

  /**
   * Method used to create the user for the parents (local)
   * It will also send a confirmation email
   * ! we need a token here to make sure it's only for the correct user
   * @param data - Object with the parent's infos
   * @returns
   */

  async create(data: ParentSignupDto, verification = true) {
    return this.prisma.userParent.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        emailVerified: verification ? null : new Date(),
        account: {
          create: {
            type: 'credentials',
            provider: 'local',
            password: await hash(data.password, 10),
          },
        },
        wallet: {
          create: {
            publicKey: 'test',
          },
        },
      },
    });
  }

  /**
   * Method used to create or get the user for the parents (OAuth2)
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

  async createChildrenFromParent(
    parentId: string,
    data: CreateChildrenDto,
    verification = true,
  ) {
    const parent = await this.prisma.userParent.findUnique({
      where: {
        id: parentId,
      },
    });
    try {
      const child = await this.prisma.userChild.create({
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
      if (verification) await this.sendChildSignupEmail(child, parent);
      return child;
    } catch (e) {
      throw new BadRequestException("Could't create child");
    }
  }

  async sendChildSignupEmail(child: UserChild, parent: UserParent) {
    const confirmationToken = this.jwtAuthService.generateChildSignupToken(
      child.id,
    );
    const url = `${this.configService.get(
      'NEXT_PUBLIC_URL',
    )}/?token=${confirmationToken}`;
    return this.emailService.sendChildSignupEmail(parent, child, url);
  }
}
