import { Module } from '@nestjs/common';
import { EthereumService } from './ethereum.service';
import { EthereumController } from './ethereum.controller';
import { ParentsModule } from 'src/users/parents/parents.module';
import { NotifyModule } from 'src/notify/notify.module';

@Module({
  imports: [ParentsModule, NotifyModule],
  controllers: [EthereumController],
  providers: [EthereumService],
})
export class EthereumModule {}
