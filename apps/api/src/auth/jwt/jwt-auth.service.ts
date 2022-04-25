import { UserParent } from '@lib/prisma';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenPayload } from './dto/JwtTokenPayload.dto';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  login(user: UserParent) {
    const payload: JwtTokenPayload = {
      userId: user.id,
    };
    return this.jwtService.sign(payload);
  }
}
