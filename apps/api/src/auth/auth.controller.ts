import {
  Controller,
  Get,
  Post,
  UseGuards,
  Session as GetSession,
  Body,
} from '@nestjs/common';
import { GetNestAuth, NestAuth } from '@lib/nest-auth/nest';
import { GetChild, GetParent } from './decorators/get-user.decorator';
import { NestAuthData } from '@lib/nest-auth/nest/types';
import { FacebookProfile, GoogleProfile } from '@lib/nest-auth/providers';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UserSessionPayload } from './session/dto/user-session.dto';
import { UserSession } from './session/user-session.interface';
import { UserType } from './decorators/user-type.decorator';
import { LocalSigninDto } from './local/dto/local-signin.dto';
import { FACEBOOK_OAUTH_CONFIG, GOOGLE_OAUTH_CONFIG } from './constants';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/parents/me')
  @UserType('parent')
  @UseGuards(AuthGuard)
  meParent(@GetParent() user: UserSessionPayload) {
    return this.authService.getParent(user);
  }

  @Get('/children/me')
  @UserType('child')
  @UseGuards(AuthGuard)
  meChild(@GetChild() user: UserSessionPayload) {
    return this.authService.getChild(user);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logout(@GetSession() session: UserSession) {
    return this.authService.logout(session);
  }

  @NestAuth('facebook', FACEBOOK_OAUTH_CONFIG)
  facebook(
    @GetNestAuth() data: NestAuthData<FacebookProfile>,
    @GetSession() session: UserSession,
  ) {
    return this.authService.authenticateParent(
      {
        id: data.profile.id,
        name: data.profile.name,
        firstName: data.profile.first_name,
        lastName: data.profile.last_name,
        email: data.profile.email,
      },
      data.provider,
      session,
    );
  }

  @NestAuth('google', GOOGLE_OAUTH_CONFIG)
  async google(
    @GetNestAuth() data: NestAuthData<GoogleProfile>,
    @GetSession() session: UserSession,
  ) {
    return this.authService.authenticateParent(
      {
        id: data.profile.sub,
        name: data.profile.name,
        firstName: data.profile.given_name,
        lastName: data.profile.family_name,
        email: data.profile.email,
      },
      data.provider,
      session,
    );
  }

  @Post('local')
  local(@Body() body: LocalSigninDto, @GetSession() session: UserSession) {
    return this.authService.authenticateParentLocal(body, session);
  }
}
