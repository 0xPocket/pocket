import { NestAuthModule } from '@lib/nest-auth/nest';
import { Module } from '@nestjs/common';
import { ParentsModule } from 'src/users/parents/parents.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthModule } from './jwt/jwt-auth.module';

@Module({
  imports: [
    PrismaModule,
    JwtAuthModule,
    NestAuthModule.forRoot(),
    ParentsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
