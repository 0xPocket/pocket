import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorators/GetUser';
import { JwtTokenPayload } from '../auth/jwt/dto/JwtTokenPayload.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@GetUser() user: JwtTokenPayload) {
    return user;
  }
}
