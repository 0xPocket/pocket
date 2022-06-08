import { Module } from '@nestjs/common';
import { EthereumService } from './ethereum.service';
import { EthereumController } from './ethereum.controller';

@Module({
  controllers: [EthereumController],
  providers: [EthereumService],
})
export class EthereumModule {}
