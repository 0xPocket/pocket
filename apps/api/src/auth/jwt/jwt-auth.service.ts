import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenPayload } from './dto/JwtTokenPayload.dto';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  generateUserToken(userId: string, isParent = true) {
    const payload: JwtTokenPayload = {
      userId: userId,
      isParent,
    };
    return this.jwtService.sign(payload);
  }
}
