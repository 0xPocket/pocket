import { Module } from '@nestjs/common';
import { EthereumService } from './ethereum.service';
import { EthereumController } from './ethereum.controller';
import { JwtAuthModule } from '../jwt/jwt-auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [JwtAuthModule, PrismaModule, SessionModule],
  controllers: [EthereumController],
  providers: [EthereumService],
})
export class EthereumModule {}
