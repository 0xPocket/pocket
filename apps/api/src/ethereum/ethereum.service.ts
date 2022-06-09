import { Injectable } from '@nestjs/common';
import { providers } from 'ethers';
import { ParentsService } from 'src/users/parents/parents.service';
import {
  SendTransactionDto,
  TransactionType,
} from './dto/send-transaction.dto';

@Injectable()
export class EthereumService {
  provider: providers.JsonRpcProvider;

  constructor(private parentsService: ParentsService) {
    this.provider = new providers.JsonRpcProvider('http://localhost:8545');
  }

  async sendTransaction(data: SendTransactionDto) {
    const test = await this.provider.sendTransaction(data.hash);

    await test.wait();

    await this.dispatch(data);

    return 'OK';
  }

  async dispatch(data: SendTransactionDto) {
    console.log('dispatch');
    switch (data.type) {
      case TransactionType.ADD_CHILD: {
        console.log('add child');
        await this.parentsService.validateChildren(data.childAddress);
        console.log('updated!');
      }
    }
  }
}
