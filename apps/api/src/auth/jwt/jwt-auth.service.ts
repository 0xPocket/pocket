import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtChildSignupTokenPayload } from './dto/JwtChildSignupTokenPayload.dto';
import { JwtTokenPayload } from './dto/JwtTokenPayload.dto';

@Injectable()
export class JwtAuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  generateAuthenticationToken(userId: string, isParent = true) {
    const payload: JwtTokenPayload = {
      userId: userId,
      isParent,
    };
    return this.jwtService.sign(payload);
  }

  generateChildSignupToken(userId: string) {
    const payload: JwtChildSignupTokenPayload = {
      userId,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_CHILD_SECRET'),
      expiresIn: '12h',
    });
  }

  verifyChildSignupToken(token: string) {
    return this.jwtService.verify<JwtChildSignupTokenPayload>(token, {
      secret: this.configService.get<string>('JWT_CHILD_SECRET'),
    });
  }
}
