import { NestAuthUser } from '@lib/nest-auth';
import { Injectable } from '@nestjs/common';
import { ParentsService } from 'src/users/parents/parents.service';
import { JwtAuthService } from './jwt/jwt-auth.service';
import { NestAuthTokenPayload } from '@lib/nest-auth';
import { LocalSigninDto } from './local/dto/local-signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private parentsService: ParentsService,
    private jwtService: JwtAuthService,
  ) {}

  async getParent(userId: string) {
    return this.parentsService.getParent(userId);
  }

  async authenticateParent(
    data: NestAuthUser,
    providerId: string,
  ): Promise<NestAuthTokenPayload> {
    const user = await this.parentsService.createOrGetOAuth(data, providerId);
    return {
      access_token: this.jwtService.generateAuthenticationToken(user.id),
    };
  }

  async authenticateParentLocal(
    data: LocalSigninDto,
    providerId: string,
  ): Promise<NestAuthTokenPayload> {
    const user = await this.parentsService.localSignin(data, providerId);
    return {
      access_token: this.jwtService.generateAuthenticationToken(user.id),
    };
  }
}
