import {
  Controller,
  Get,
  Post,
  UseGuards,
  Session as GetSession,
} from '@nestjs/common';
import { GetChild, GetParent } from './decorators/get-user.decorator';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UserSessionPayload } from './session/dto/user-session.dto';
import { UserSession } from './session/user-session.interface';
import { UserType } from './decorators/user-type.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/parents/me')
  @UserType('parent')
  @UseGuards(AuthGuard)
  meParent(@GetParent() user: UserSessionPayload) {
    return this.authService.getParent(user);
  }

  @Get('/children/me')
  @UserType('child')
  @UseGuards(AuthGuard)
  meChild(@GetChild() user: UserSessionPayload) {
    return this.authService.getChild(user);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logout(@GetSession() session: UserSession) {
    return this.authService.logout(session);
  }
}
