import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { JwtTokenPayload } from './dto/JwtTokenPayload.dto';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  login(user: User) {
    const payload: JwtTokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }
}
