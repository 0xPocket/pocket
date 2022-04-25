import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { NestAuth } from '@lib/nest-auth/nest';
import Credentials from '@lib/nest-auth/providers/credentials';
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

  @NestAuth(
    Credentials({
      id: 'local',
    }),
  )
  local(@Body() body: LocalSigninDto) {
    return this.jwtService.login(body as any);
  }
}
