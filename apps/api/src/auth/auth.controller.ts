import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { GetNestAuth, NestAuth } from '@lib/nest-auth/nest';
// import Credentials from '@lib/nest-auth/providers/credentials';
import { LocalSigninDto } from './local/dto/local-signin.dto';
import { JwtAuthService } from './jwt/jwt-auth.service';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtAuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me() {
    return 'its me';
  }

  @NestAuth('github', {
    clientId: 'ea0c0484c5065e20d140',
    secretId: '"e1a5542598e286578cda9369b1b51620ba491b6b',
  })
  github(@GetNestAuth() data: any) {
    console.log(data);
    return 'TEST';
  }

  @NestAuth('facebookb', {
    clientId: '1565875930465432',
    secretId: 'f89c565919e7c6d3060389919101e16c',
    redirectUri: 'http://localhost:3000/',
  })
  facebook(@GetNestAuth() data: any) {
    console.log(data);
    return 'TEST';
  }

  // @NestAuth('local', {})
  // local(@Body() body: LocalSigninDto) {
  //   return this.jwtService.login(body as any);
  // }
}
