import { Module } from '@nestjs/common';
import { MagicService } from './magic.service';
import { MagicController } from './magic.controller';
import { JwtAuthModule } from '../jwt/jwt-auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SessionModule } from '../session/session.module';
import { ParentsModule } from 'src/users/parents/parents.module';

@Module({
  imports: [JwtAuthModule, PrismaModule, SessionModule, ParentsModule],
  controllers: [MagicController],
  providers: [MagicService],
})
export class MagicModule {}
