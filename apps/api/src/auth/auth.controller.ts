import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { GetNestAuth, NestAuth } from '@lib/nest-auth/nest';
import { GetUserParent } from './decorators/get-user.decorator';
import { NestAuthData } from '@lib/nest-auth/nest/types';
import { FacebookProfile, GoogleProfile } from '@lib/nest-auth/providers';
import { AuthService } from './auth.service';
import { LocalSigninDto } from './local/dto/local-signin.dto';
import { JwtTokenPayload } from './jwt/dto/JwtTokenPayload.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@GetUserParent() user: JwtTokenPayload) {
    return this.authService.getParent(user);
  }

  @NestAuth('facebook', {
    clientId: process.env.OAUTH_FACEBOOK_ID,
    secretId: process.env.OAUTH_FACEBOOK_SECRET,
    redirectUri: process.env.OAUTH_FACEBOOK_REDIRECT_URL,
    params: {
      fields: 'id,email,name,first_name,last_name',
    },
  })
  facebook(@GetNestAuth() data: NestAuthData<FacebookProfile>) {
    return this.authService.authenticateParent(
      {
        id: data.profile.id,
        name: data.profile.name,
        firstName: data.profile.first_name,
        lastName: data.profile.last_name,
        email: data.profile.email,
      },
      data.provider,
    );
  }

  @NestAuth('google', {
    clientId: process.env.OAUTH_GOOGLE_ID,
    secretId: process.env.OAUTH_GOOGLE_SECRET,
    redirectUri: process.env.OAUTH_GOOGLE_REDIRECT_URL,
  })
  google(@GetNestAuth() data: NestAuthData<GoogleProfile>) {
    return this.authService.authenticateParent(
      {
        id: data.profile.sub,
        name: data.profile.name,
        firstName: data.profile.given_name,
        lastName: data.profile.family_name,
        email: data.profile.email,
      },
      data.provider,
    );
  }

  @Post('local')
  local(@Body() body: LocalSigninDto) {
    return this.authService.authenticateParentLocal(body, 'local');
  }
}
