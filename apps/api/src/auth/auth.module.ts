import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { GoogleOauthModule } from './google/google-oauth.module';

@Module({
  imports: [PrismaModule, GoogleOauthModule],
  controllers: [AuthController],
})
export class AuthModule {}
