import { NestAuthModule } from '@lib/nest-auth/nest';
import { Module } from '@nestjs/common';
import { PasswordModule } from 'src/password/password.module';
import { ChildrenModule } from 'src/users/children/children.module';
import { ParentsModule } from 'src/users/parents/parents.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EthereumModule } from './ethereum/ethereum.module';
import { JwtAuthModule } from './jwt/jwt-auth.module';
import { MetamaskModule } from './metamask/metamask.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    PrismaModule,
    SessionModule,
    JwtAuthModule,
    NestAuthModule.forRoot(),
    ParentsModule,
    ChildrenModule,
    MetamaskModule,
    PasswordModule,
    EthereumModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
