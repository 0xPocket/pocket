import { User } from '@lib/prisma';
import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Cookie } from '../decorators/Cookie';
import { GetUser } from '../decorators/GetUser';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { GoogleOauthGuard } from './google-oauth.guard';

@Controller('auth/google')
export class GoogleOauthController {
  constructor(
    private jwtAuthService: JwtAuthService,
    private configService: ConfigService,
  ) {}

  @Get()
  @UseGuards(GoogleOauthGuard)
  async auth() {
    // Guard redirect
  }

  @Get('callback')
  @UseGuards(GoogleOauthGuard)
  callback(
    @GetUser() user: User,
    @Cookie('auth.redirect_url') cookie: string,
    @Res() res: Response,
  ) {
    const accessToken = this.jwtAuthService.login(user);
    res.cookie(this.configService.get<string>('COOKIE_AUTH_KEY'), accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    res.clearCookie('auth.redirect_url');
    return res.redirect(cookie);
  }
}
