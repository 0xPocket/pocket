import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ParentSignupDto } from './dto/parent-signup.dto';

@Injectable()
export class ParentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Method used to create the user for the parents
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
}
