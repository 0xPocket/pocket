import { Module } from '@nestjs/common';
import { ChildrenService } from './children.service';
import { ChildrenController } from './children.controller';

@Module({
  controllers: [ChildrenController],
  providers: [ChildrenService],
})
export class ChildrenModule {}
