import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res() res: Response) {
    res.clearCookie(process.env.COOKIE_AUTH_KEY);
    res.sendStatus(200);
  }
}
