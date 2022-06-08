import { NestAuthUser } from '@lib/nest-auth';
import { Injectable } from '@nestjs/common';
import { ParentsService } from 'src/users/parents/parents.service';
import { JwtAuthService } from './jwt/jwt-auth.service';
import { ChildrenService } from 'src/users/children/children.service';
import { UserSession } from './session/user-session.interface';
import { SessionService } from './session/session.service';
import { UserSessionPayload } from './session/dto/user-session.dto';

@Injectable()
export class AuthService {
  constructor(
    private parentsService: ParentsService,
    private childrenService: ChildrenService,
    private jwtService: JwtAuthService,
    private sessionService: SessionService,
  ) {}

  logout(session: UserSession) {
    return this.sessionService.destroySession(session);
  }

  async getParent(user: UserSessionPayload) {
    return this.parentsService.getParent(user.userId);
  }

  async getChild(user: UserSessionPayload) {
    return this.childrenService.getChild(user.userId);
  }

  async authenticateParent(
    data: NestAuthUser,
    providerId: string,
    session: UserSession = null,
  ) {
    const user = await this.parentsService.createOrGetOAuth(data, providerId);
    if (session) this.sessionService.setUserSession(session, user.id);
    return {
      access_token: this.jwtService.generateAuthenticationToken(user.id),
    };
  }
}
