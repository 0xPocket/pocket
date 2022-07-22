import { Body, Controller, Post, Session } from '@nestjs/common';
import { UserSession } from '../session/user-session.interface';
import { MagicService } from './magic.service';

@Controller('auth/magic')
export class MagicController {
  constructor(private readonly magicService: MagicService) {}

  @Post()
  verifyDidToken(
    @Body() body: { token: string },
    @Session() session: UserSession,
  ) {
    return this.magicService.verifyDidToken(body, session);
  }
}
