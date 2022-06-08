import { NestAuthUser } from '@lib/nest-auth';
import { UserChild, UserParent } from '@lib/prisma';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthService } from 'src/auth/jwt/jwt-auth.service';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChildrenDto } from './dto/create-children.dto';

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
      include: {
        account: {
          select: {
            type: true,
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
        // wallet: {
        //   create: this.walletService.generateWallet(),
        // },
      },
      update: {},
    });
  }

  async getParentChildren(userId: string) {
    return this.prisma.userChild.findMany({
      where: {
        userParentId: userId,
      },
      include: {
        web3Account: true,
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
    try {
      const [parent, child] = await Promise.all([
        this.prisma.userParent.findUnique({
          where: {
            id: parentId,
          },
        }),
        this.prisma.userChild.create({
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
        }),
      ]);
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
      'NEXT_PUBLIC_CHILDREN_URL',
    )}/onboarding?token=${confirmationToken}`;
    return this.emailService.sendChildSignupEmail(parent, child, url);
  }
}
