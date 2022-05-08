import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChildrenService {
  constructor(private prisma: PrismaService) {}

  getChild(userId: string) {
    return this.prisma.userChild.findUnique({
      where: {
        id: userId,
      },
    });
  }
}
