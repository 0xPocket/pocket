import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { providers } from 'ethers';
import { ErrorTypes, generateNonce, SiweMessage } from 'siwe';
import { UserSession } from '../session/user-session.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { RegisterWithTokenDto } from './dto/register-with-token.dto';
import { SessionService } from '../session/session.service';
import { VerifyMessageDto } from './dto/verify-message.dto';

class LoginTimeout extends HttpException {
  constructor(message?: string) {
    super(message || 'Login Timeout', 440);
  }
}

@Injectable()
export class EthereumService {
  provider: providers.JsonRpcProvider;

  constructor(
    private jwtAuthService: JwtAuthService,
    private prisma: PrismaService,
    private sessionService: SessionService,
  ) {}

  generateNonce() {
    return generateNonce();
  }

  async registerWithToken(
    { message, signature, token }: RegisterWithTokenDto,
    session: UserSession,
  ) {
    try {
      const payload = this.jwtAuthService.verifyChildSignupToken(token);

      if (payload) {
        const user = await this.prisma.userChild.findUnique({
          where: {
            id: payload.userId,
          },
        });

        if (user) {
          throw new Error();
        }

        const validMessage = await this.verifyMessage(
          message,
          signature,
          session,
        );

        return this.prisma.web3Account.create({
          data: {
            address: validMessage.address.toLowerCase(),
            nonce: generateNonce(),
            user: {
              connect: {
                id: payload.userId,
              },
            },
          },
        });
      }
    } catch (e) {
      throw new BadRequestException('Problem registering');
    }
  }

  async login({ message, signature }: VerifyMessageDto, session: UserSession) {
    await this.verifyMessage(message, signature, session);
    return 'OK';
  }

  async verifyMessage(
    message: SiweMessage,
    signature: string,
    session: UserSession,
  ) {
    try {
      const siweMessage = new SiweMessage(message);
      const fields = await siweMessage.validate(signature);

      if (fields.nonce !== session.nonce) {
        throw new UnprocessableEntityException('Invalid nonce.');
      }

      const account = await this.prisma.web3Account.findUnique({
        where: {
          address: fields.address.toLowerCase(),
        },
      });

      if (!account) {
        throw new Error();
      }

      if (session) {
        this.sessionService.setUserSession(session, account.userId, false);
      }

      return fields;
    } catch (e) {
      session.nonce = null;

      switch (e) {
        case ErrorTypes.EXPIRED_MESSAGE: {
          throw new LoginTimeout('Message is expired.');
        }
        case ErrorTypes.INVALID_SIGNATURE: {
          throw new UnprocessableEntityException('Invalid signature.');
        }
        default: {
          throw new ForbiddenException('You are not registered.');
        }
      }
    }
  }
}
