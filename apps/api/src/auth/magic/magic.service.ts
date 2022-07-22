import { Magic } from '@magic-sdk/admin';
import { Injectable } from '@nestjs/common';
import { ParentsService } from 'src/users/parents/parents.service';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { SessionService } from '../session/session.service';
import { UserSession } from '../session/user-session.interface';

@Injectable()
export class MagicService {
  magic = new Magic('sk_live_8185E1937878AC9A');

  constructor(
    private parentService: ParentsService,
    private jwtService: JwtAuthService,
    private sessionService: SessionService,
  ) {}

  async verifyDidToken(body: { token: string }, session: UserSession) {
    try {
      this.magic.token.validate(body.token);
    } catch (e) {
      console.error(e);
      return null;
    }

    const userAddress = this.magic.token.getPublicAddress(body.token);
    const userMetadata = await this.magic.users.getMetadataByPublicAddress(
      userAddress,
    );

    const user = await this.parentService.createOrGetMagic({
      email: userMetadata.email,
      address: userAddress,
    });

    if (session) this.sessionService.setUserSession(session, user.id);
    return {
      access_token: this.jwtService.generateAuthenticationToken(user.id),
    };
  }
}
