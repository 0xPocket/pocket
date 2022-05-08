import { NestAuthModule } from '@lib/nest-auth/nest';
import { Module } from '@nestjs/common';
import { ChildrenModule } from 'src/users/children/children.module';
import { ParentsModule } from 'src/users/parents/parents.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthModule } from './jwt/jwt-auth.module';
import { MetamaskModule } from './metamask/metamask.module';

@Module({
  imports: [
    PrismaModule,
    JwtAuthModule,
    NestAuthModule.forRoot(),
    ParentsModule,
    ChildrenModule,
    MetamaskModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
