import { Body, Controller, Post, Session } from '@nestjs/common';
import { UserSession } from '../session/user-session.interface';
import { MetamaskNonceDto } from './dto/nonce.dto';
import { MetamaskSignatureDto } from './dto/signature.dto';
import { MetamaskTokenDto } from './dto/token.dto';
import { MetamaskService } from './metamask.service';

@Controller('metamask')
export class MetamaskController {
  constructor(private readonly metamaskService: MetamaskService) {}

  @Post('register')
  register(@Body() dto: MetamaskTokenDto) {
    return this.metamaskService.registerWithToken(dto);
  }

  @Post('nonce')
  nonceAuth(@Body() dto: MetamaskNonceDto) {
    return this.metamaskService.generateNonce(dto);
  }

  @Post('verify')
  verify(@Body() dto: MetamaskSignatureDto, @Session() session: UserSession) {
    return this.metamaskService.verifySignature(dto, session);
  }
}
