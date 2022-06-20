import { Session } from 'express-session';
import { UserSessionPayload } from './dto/user-session.dto';

export type UserSession = Session &
  Record<'nonce', string> &
  Record<'parent', UserSessionPayload> &
  Record<'child', UserSessionPayload>;
