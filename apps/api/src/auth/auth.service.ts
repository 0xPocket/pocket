import { NestAuthUser } from '@lib/nest-auth';
import { Injectable } from '@nestjs/common';
import { ParentsService } from 'src/users/parents/parents.service';
import { JwtAuthService } from './jwt/jwt-auth.service';
import { NestAuthTokenPayload } from '@lib/nest-auth';
import { LocalSigninDto } from './local/dto/local-signin.dto';
import { JwtTokenPayload } from './jwt/dto/JwtTokenPayload.dto';
import { ChildrenService } from 'src/users/children/children.service';

@Injectable()
export class AuthService {
  constructor(
    private parentsService: ParentsService,
    private childrenService: ChildrenService,
    private jwtService: JwtAuthService,
  ) {}

  async getParent(user: JwtTokenPayload) {
    if (user.isParent) return this.parentsService.getParent(user.userId);
    return this.childrenService.getChild(user.userId);
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
