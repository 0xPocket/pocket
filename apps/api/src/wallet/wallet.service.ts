import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    const wallet = await this.prisma.userParentWallet.findUnique({
      where: {
        userParentId: userId,
      },
    });

    if (!wallet) {
      throw new NotFoundException('No Wallet');
    }

    return wallet;
  }

  async createWallet(userId: string, data: CreateWalletDto) {
    const user = await this.prisma.userParent.findUnique({
      where: {
        id: userId,
      },
      include: {
        wallet: true,
      },
    });

    if (user.wallet) {
      throw new BadRequestException('You already have a wallet setup !');
    }

    return this.prisma.userParentWallet.create({
      data: {
        publicKey: data.publicKey,
        encryptedPrivateKey: data.encryptedPrivateKey,
        userParent: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }
}
