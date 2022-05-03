import { Module } from '@nestjs/common';
import { MetamaskService } from './metamask.service';
import { MetamaskController } from './metamask.controller';
import { JwtAuthModule } from '../jwt/jwt-auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [JwtAuthModule, PrismaModule],
  controllers: [MetamaskController],
  providers: [MetamaskService],
})
export class MetamaskModule {}
