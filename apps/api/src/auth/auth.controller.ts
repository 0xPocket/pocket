import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { NestAuth } from '@lib/nest-auth/nest';
import { JwtAuthService } from './jwt/jwt-auth.service';
import { AuthGuard } from './auth.guard';
import { GetUserParent } from './decorators/get-user.decorator';
import { UserParent } from '@lib/prisma';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtAuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) {
    return req.user;
  }

  @NestAuth(
    'facebook',
    {
      clientId: '1565875930465432',
      secretId: 'f89c565919e7c6d3060389919101e16c',
      redirectUri: 'http://localhost:3000/',
      params: {
        fields: 'id,email,name,first_name,last_name',
      },
    },
    AuthGuard,
  )
  facebook(@GetUserParent() user: UserParent) {
    return {
      access_token: this.jwtService.login(user),
    };
  }

  // @NestAuth('local', {})
  // local(@Body() body: LocalSigninDto) {
  //   return this.jwtService.login(body as any);
  // }
}
