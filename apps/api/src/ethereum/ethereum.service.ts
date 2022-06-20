import { Injectable } from '@nestjs/common';
import { providers } from 'ethers';
import { ParentsService } from 'src/users/parents/parents.service';
import {
  SendTransactionDto,
  TransactionType,
} from './dto/send-transaction.dto';
import {
  PocketFaucet,
  PocketFaucet__factory,
} from '@pocket-contract/typechain-types';

@Injectable()
export class EthereumService {
  provider: providers.JsonRpcProvider;
  contract: PocketFaucet;

  constructor(private parentsService: ParentsService) {
    this.provider = new providers.JsonRpcProvider('http://localhost:8545');

    this.contract = PocketFaucet__factory.connect(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      this.provider,
    );

    this.contract.on(
      this.contract.filters['childAdded(address,address)'](),
      (parentAddress, childAddress) => {
        this.parentsService.validateChildren(childAddress.toLowerCase());
        // console.log(parentAddress);
        // console.log('child to validate :', childAddress.toLowerCase());
      },
    );

    this.contract.on(
      this.contract.filters['fundsAdded(address,uint256,address)'](),
      (parentAddress, amount, childAddress) => {
        // this.parentsService.validateChildren(childAddress.toLowerCase());
        console.log('FUNDS ADDED EVENT');
        // console.log('child to validate :', childAddress.toLowerCase());
      },
    );
  }

  async sendTransaction(data: SendTransactionDto) {
    return this.provider.sendTransaction(data.hash);
  }

  async dispatch(data: SendTransactionDto) {
    console.log('dispatch');
    switch (data.type) {
      case TransactionType.ADD_CHILD: {
        console.log('add child');
        // await this.parentsService.validateChildren(data.childAddress);
        console.log('updated!');
      }
    }
  }
}
