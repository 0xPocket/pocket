import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      // Put config in `.env`
      clientID: configService.get<string>('OAUTH_GOOGLE_ID'),
      clientSecret: configService.get<string>('OAUTH_GOOGLE_SECRET'),
      callbackURL: configService.get<string>('OAUTH_GOOGLE_REDIRECT_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const { id, name, emails } = profile;

    const user = await this.usersService.getOrCreateOAuthUser(
      {
        email: emails[0].value,
        name: `${name.givenName} ${name.familyName}`,
      },
      {
        provider: this.name,
        providerAccountId: id,
        access_token: _accessToken,
        refresh_token: _refreshToken,
      },
    );

    return user;
  }
}
