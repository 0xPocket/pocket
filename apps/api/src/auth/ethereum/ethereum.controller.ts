import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { UserSession } from '../session/user-session.interface';
import { RegisterWithTokenDto } from './dto/register-with-token.dto';
import { VerifyMessageDto } from './dto/verify-message.dto';
import { EthereumService } from './ethereum.service';

@Controller('auth/ethereum')
export class EthereumController {
  constructor(private readonly ethereumService: EthereumService) {}

  @Get('nonce')
  nonceAuth(@Session() session: UserSession) {
    session.nonce = this.ethereumService.generateNonce();
    return session.nonce;
  }

  @Post('register')
  registerWithToken(
    @Body() dto: RegisterWithTokenDto,
    @Session() session: UserSession,
  ) {
    return this.ethereumService.registerWithToken(dto, session);
  }

  @Post('verify')
  verifyMessage(
    @Body() dto: VerifyMessageDto,
    @Session() session: UserSession,
  ) {
    return this.ethereumService.verifyMessage(
      dto.message,
      dto.signature,
      session,
    );
  }
}
