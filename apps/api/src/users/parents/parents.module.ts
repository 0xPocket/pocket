import { Module } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { ParentsController } from './parents.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ParentExistsRule } from './validators/ParentExists.validator';

@Module({
  imports: [PrismaModule],
  controllers: [ParentsController],
  providers: [ParentsService, ParentExistsRule],
  exports: [ParentsService],
})
export class ParentsModule {}
