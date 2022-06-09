import { Module } from '@nestjs/common';
import { EthereumService } from './ethereum.service';
import { EthereumController } from './ethereum.controller';
import { ParentsModule } from 'src/users/parents/parents.module';

@Module({
  imports: [ParentsModule],
  controllers: [EthereumController],
  providers: [EthereumService],
})
export class EthereumModule {}
