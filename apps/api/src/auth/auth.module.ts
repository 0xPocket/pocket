import { NestAuthModule } from '@lib/nest-auth/nest';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { JwtAuthModule } from './jwt/jwt-auth.module';

@Module({
  imports: [PrismaModule, JwtAuthModule, NestAuthModule.forRoot()],
  controllers: [AuthController],
})
export class AuthModule {}
