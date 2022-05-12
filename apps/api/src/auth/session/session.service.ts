import { Injectable } from '@nestjs/common';
import { UserSession } from './user-session.interface';

@Injectable()
export class SessionService {
  setUserSession(session: UserSession, userId: string, isParent = true) {
    if (isParent) {
      session.parent = {
        userId: userId,
      };
    } else {
      session.child = {
        userId: userId,
      };
    }
  }

  destroySession(session: UserSession) {
    return new Promise((resolve, reject) => {
      session.destroy((err) => {
        if (err) reject(err);
        resolve(undefined);
      });
    });
  }
}
