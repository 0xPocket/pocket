import { Injectable } from '@nestjs/common';
import { providers } from 'ethers';
import { SendTransactionDto } from './dto/send-transaction.dto';

@Injectable()
export class EthereumService {
  provider: providers.JsonRpcProvider;

  constructor() {
    this.provider = new providers.JsonRpcProvider('http://localhost:8545');
  }

  sendTransaction(data: SendTransactionDto) {
    return this.provider.sendTransaction(data.hash);
  }
}
