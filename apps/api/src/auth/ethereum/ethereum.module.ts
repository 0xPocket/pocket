import { Module } from '@nestjs/common';
import { EthereumService } from './ethereum.service';
import { EthereumController } from './ethereum.controller';
import { ParentsModule } from 'src/users/parents/parents.module';
import { JwtAuthModule } from '../jwt/jwt-auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [JwtAuthModule, PrismaModule],
  controllers: [EthereumController],
  providers: [EthereumService],
})
export class EthereumModule {}
