import { Module } from '@nestjs/common';
import { RampService } from './ramp.service';
import { RampController } from './ramp.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RampController],
  providers: [RampService],
})
export class RampModule {}
