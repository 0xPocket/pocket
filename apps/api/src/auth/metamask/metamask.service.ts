import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { MetamaskNonceDto } from './dto/nonce.dto';
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';
import { MetamaskSignatureDto } from './dto/signature.dto';
import { MetamaskTokenDto } from './dto/token.dto';
import { UserSession } from '../session/user-session.interface';
import { SessionService } from '../session/session.service';

@Injectable()
export class MetamaskService {
  private message = `Welcome to Pocket !\n\nPlease sign this message to authenticate on the app.\n\nNonce : \\nonce\\`;

  constructor(
    private jwtAuthService: JwtAuthService,
    private prisma: PrismaService,
    private sessionService: SessionService,
  ) {}

  registerWithToken(data: MetamaskTokenDto) {
    try {
      const payload = this.jwtAuthService.verifyChildSignupToken(data.token);

      if (payload) {
        return this.prisma.web3Account.upsert({
          where: {
            address: data.walletAddress.toLowerCase(),
          },
          create: {
            address: data.walletAddress.toLowerCase(),
            nonce: uuidv4(),
            user: {
              connect: {
                id: payload.userId,
              },
            },
          },
          update: {},
        });
      }
    } catch (e) {
      throw new BadRequestException();
    }
  }

  getWeb3Account(address: string) {
    return this.prisma.web3Account.findUnique({
      where: {
        address: address.toLowerCase(),
      },
      include: {
        user: true,
      },
    });
  }

  async generateNonce(data: MetamaskNonceDto) {
    const web3Account = await this.getWeb3Account(data.walletAddress);

    if (!web3Account) throw new NotFoundException("This user doesn't exists");

    return {
      nonce: this.getMessageFromNonce(web3Account.nonce),
    };
  }

  getWeb3AccountByAddress(address: string) {
    return this.prisma.web3Account.findUnique({
      where: {
        address: address.toLowerCase(),
      },
      include: {
        user: true,
      },
    });
  }

  regenerateNonce(accountId: string) {
    return this.prisma.web3Account.update({
      where: {
        id: accountId,
      },
      data: {
        nonce: uuidv4(),
      },
    });
  }

  getMessageFromNonce(nonce: string) {
    return this.message.replace('\\nonce\\', nonce);
  }

  async verifySignature(data: MetamaskSignatureDto, session: UserSession) {
    const accountToVerify = await this.getWeb3AccountByAddress(
      data.walletAddress,
    );
    const message = this.getMessageFromNonce(accountToVerify.nonce);

    const verifiedWalletAddress = ethers.utils.verifyMessage(
      message,
      data.signature,
    );

    if (verifiedWalletAddress.toLowerCase() !== accountToVerify.address) {
      throw new ForbiddenException('Invalid signature');
    }

    await this.regenerateNonce(accountToVerify.id);

    this.sessionService.setUserSession(session, accountToVerify.user.id, false);

    return {
      access_token: this.jwtAuthService.generateAuthenticationToken(
        accountToVerify.user.id,
        false,
      ),
    };
  }
}
