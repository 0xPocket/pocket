import { Module } from '@nestjs/common';
import { EthereumService } from './ethereum.service';
import { ParentsModule } from 'src/users/parents/parents.module';
import { NotifyModule } from 'src/notify/notify.module';

@Module({
  imports: [ParentsModule, NotifyModule],
  providers: [EthereumService],
})
export class EthereumModule {}
