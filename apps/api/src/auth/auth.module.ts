import { Module } from '@nestjs/common';
import { ChildrenModule } from 'src/users/children/children.module';
import { ParentsModule } from 'src/users/parents/parents.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EthereumModule } from './ethereum/ethereum.module';
import { JwtAuthModule } from './jwt/jwt-auth.module';
import { MagicModule } from './magic/magic.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    PrismaModule,
    SessionModule,
    JwtAuthModule,
    ParentsModule,
    ChildrenModule,
    EthereumModule,
    MagicModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
