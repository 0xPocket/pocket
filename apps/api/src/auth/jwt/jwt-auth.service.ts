import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtChildSignupTokenPayload } from './dto/JwtChildSignupTokenPayload.dto';
import { JwtEmailTokenPayload } from './dto/JwtEmailTokenPayload.dto';
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

  generateEmailConfirmationToken(email: string) {
    const payload: JwtEmailTokenPayload = {
      email,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_EMAIL_SECRET'),
      expiresIn: '1h',
    });
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
}
