import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
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
    try {
      const validMessage = await this.verifyMessage(
        message,
        signature,
        session,
      );
      return this.prisma.web3Account.findUnique({
        where: {
          address: validMessage.address.toLowerCase(),
        },
      });
    } catch (e) {
      throw new BadRequestException('Problem logging in');
    }
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

      if (session) {
        this.sessionService.setUserSession(session, 'damianmusk', false);
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
          throw new InternalServerErrorException();
        }
      }
    }
  }
}
