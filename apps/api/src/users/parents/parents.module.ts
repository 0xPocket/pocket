import { Module } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { ParentsController } from './parents.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ParentExistsRule } from './validators/ParentExists.validator';
import { EmailModule } from 'src/email/email.module';
import { JwtAuthModule } from 'src/auth/jwt/jwt-auth.module';

@Module({
  imports: [PrismaModule, EmailModule, JwtAuthModule],
  controllers: [ParentsController],
  providers: [ParentsService, ParentExistsRule],
  exports: [ParentsService],
})
export class ParentsModule {}
