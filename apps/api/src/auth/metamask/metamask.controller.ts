import { Body, Controller, Post } from '@nestjs/common';
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
  verify(@Body() dto: MetamaskSignatureDto) {
    return this.metamaskService.verifySignature(dto);
  }
}
