import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ParentsModule } from './users/parents/parents.module';
import { ChildrenModule } from './users/children/children.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { WalletModule } from './wallet/wallet.module';
import { NotifyModule } from './notify/notify.module';
import { EthereumModule } from './ethereum/ethereum.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['../../.env', '../../packages/pocket-contract/.env'],
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    ParentsModule,
    ChildrenModule,
    EmailModule,
    WalletModule,
    NotifyModule,
    EthereumModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
