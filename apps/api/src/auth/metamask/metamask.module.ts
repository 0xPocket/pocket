import { Module } from '@nestjs/common';
import { MetamaskService } from './metamask.service';
import { MetamaskController } from './metamask.controller';
import { JwtAuthModule } from '../jwt/jwt-auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [JwtAuthModule, PrismaModule, SessionModule],
  controllers: [MetamaskController],
  providers: [MetamaskService],
})
export class MetamaskModule {}
