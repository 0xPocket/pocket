import { Module } from '@nestjs/common';
import { RampService } from './ramp.service';
import { RampController } from './ramp.controller';

@Module({
  controllers: [RampController],
  providers: [RampService],
})
export class RampModule {}
