import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtTokenPayload } from './dto/JwtTokenPayload.dto';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const extractJwtFromCookie = (req: Request) => {
      let token = null;

      if (req && req.cookies) {
        token = req.cookies[configService.get<string>('COOKIE_AUTH_KEY')];
      }
      return token;
    };

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromCookie]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtTokenPayload) {
    return payload;
  }
}
