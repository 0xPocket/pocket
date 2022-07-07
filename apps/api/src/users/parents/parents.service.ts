import { NestAuthUser } from '@lib/nest-auth';
import { UserChild, UserParent } from '@lib/prisma';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthService } from 'src/auth/jwt/jwt-auth.service';
import { LocalSigninDto } from 'src/auth/local/dto/local-signin.dto';
import { EmailService } from 'src/email/email.service';
import { PasswordService } from 'src/password/password.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChildrenDto } from './dto/create-children.dto';

@Injectable()
export class ParentsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private jwtAuthService: JwtAuthService,
    private configService: ConfigService,
    private passwordService: PasswordService,
  ) {}

  getParent(userId: string) {
    return this.prisma.userParent.findUnique({
      where: {
        id: userId,
      },
      include: {
        account: {
          select: {
            type: true,
          },
        },
      },
    });
  }

  async localSignin(data: LocalSigninDto) {
    const user = await this.prisma.userParent.findUnique({
      where: {
        email: data.email,
      },
      include: {
        account: true,
      },
    });

    if (
      !user ||
      !this.passwordService.comparePassword(
        data.password,
        user.account.password,
      )
    ) {
      throw new ForbiddenException('Invalid credentials');
    }

    return user;
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

    if (user && user.account.provider !== providerId) {
      throw new BadRequestException(
        `You must connect your account with ${user.account.provider}`,
      );
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
      },
      update: {},
    });
  }

  async getParentChildren(parentId: string) {
    return this.prisma.userChild.findMany({
      where: {
        userParentId: parentId,
      },
      include: {
        web3Account: true,
      },
    });
  }

  /**
   * ! What to do if a child with the same email is pending ?
   * ! Different error message for unique email and fail mail sending
   * ! Delete child if mail fails
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

    let child: UserChild;

    try {
      child = await this.prisma.userChild.create({
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
      console.log(child);
    } catch (e) {
      throw new BadRequestException(
        'A child with the same email already exists',
      );
    }

    try {
      if (verification) await this.sendChildSignupEmail(child, parent);
    } catch (e) {
      await this.prisma.userChild.delete({
        where: {
          id: child.id,
        },
      });
      throw new InternalServerErrorException();
    }

    return child;
  }

  async validateChildren(childAddress: string) {
    const child = await this.prisma.userChild.findFirst({
      where: {
        web3Account: {
          address: {
            equals: childAddress,
            mode: 'insensitive',
          },
        },
      },
    });

    if (!child) {
      throw new BadRequestException("Child doesn't exists");
    }

    return this.prisma.userChild.update({
      where: {
        id: child.id,
      },
      data: {
        status: 'ACTIVE',
      },
    });
  }

  async sendChildSignupEmail(child: UserChild, parent: UserParent) {
    const confirmationToken = this.jwtAuthService.generateChildSignupToken(
      child.id,
    );
    const url = `${this.configService.get(
      'NEXT_PUBLIC_CHILDREN_URL',
    )}/onboarding?token=${confirmationToken}`;
    return this.emailService.sendChildSignupEmail(parent, child, url);
  }
}
