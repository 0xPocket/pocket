import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenPayload } from './dto/JwtTokenPayload.dto';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  login(userId: string) {
    const payload: JwtTokenPayload = {
      userId: userId,
    };
    return this.jwtService.sign(payload);
  }
}
