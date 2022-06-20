import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { providers } from 'ethers';
import { ParentsService } from 'src/users/parents/parents.service';
import { ErrorTypes, generateNonce, SiweMessage } from 'siwe';
import { VerifyMessageDto } from './dto/verify-message.dto';
import { UserSession } from '../session/user-session.interface';

class LoginTimeout extends HttpException {
  constructor(message?: string) {
    super(message || 'Login Timeout', 440);
  }
}

@Injectable()
export class EthereumService {
  provider: providers.JsonRpcProvider;

  constructor(private parentsService: ParentsService) {}

  generateNonce() {
    return generateNonce();
  }

  async verifyMessage(dto: VerifyMessageDto, session: UserSession) {
    try {
      const siweMessage = new SiweMessage(dto.message);
      const fields = await siweMessage.validate(dto.signature);
      if (fields.nonce !== session.nonce) {
        throw new UnprocessableEntityException('Invalid nonce.');
      }
      return true;
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

      return false;
    }
  }
}
