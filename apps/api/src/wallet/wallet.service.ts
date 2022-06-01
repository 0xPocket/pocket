import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AES, enc } from 'crypto-js';
import { Wallet } from 'ethers';
import { PasswordService } from 'src/password/password.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
  ) {}

  generateWallet() {
    const wallet = Wallet.createRandom();
    return {
      publicKey: wallet.address,
      privateKey: wallet.privateKey,
    };
  }

  encryptPK(privateKey: string, passwordHash: string) {
    return AES.encrypt(privateKey, passwordHash).toString();
  }

  decryptPK(encryptedPK: string, passwordHash: string) {
    return AES.decrypt(encryptedPK, passwordHash).toString(enc.Utf8);
  }

  getWallet(userId: string) {
    return this.prisma.userParentWallet.findUnique({
      where: {
        userParentId: userId,
      },
    });
  }

  async createWallet(userId: string, data: CreateWalletDto) {
    const user = await this.prisma.userParent.findUnique({
      where: {
        id: userId,
      },
      include: {
        account: true,
        wallet: true,
      },
    });

    if (user.wallet) {
      throw new BadRequestException('You already have a wallet setup !');
    }

    if (user.account.type === 'oauth') {
      user.account = await this.prisma.account.update({
        where: {
          id: user.account.id,
        },
        data: {
          password: this.passwordService.encryptPassword(data.password),
        },
      });
    } else if (user.account.type === 'credentials') {
      if (
        !this.passwordService.comparePassword(
          data.password,
          user.account.password,
        )
      )
        throw new UnauthorizedException(
          "The password doesn't match your account password",
        );
    }

    const wallet = this.generateWallet();

    await this.prisma.userParentWallet.create({
      data: {
        publicKey: wallet.publicKey,
        encryptedPrivateKey: this.encryptPK(
          wallet.privateKey,
          user.account.password,
        ),
        userParent: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }
}
