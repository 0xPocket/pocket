import { Injectable } from '@nestjs/common';
import { Contract, providers } from 'ethers';
import { ParentsService } from 'src/users/parents/parents.service';
import {
  SendTransactionDto,
  TransactionType,
} from './dto/send-transaction.dto';
import * as PocketFaucet from 'pocket-contract/artifacts/contracts/PocketFaucet.sol/PocketFaucet.json';

// import {
//   PocketFaucet,
//   PocketFaucet__factory,
// } from 'pocket-contract/typechain-types';

@Injectable()
export class EthereumService {
  provider: providers.JsonRpcProvider;
  // contract: PocketFaucet;

  constructor(private parentsService: ParentsService) {
    this.provider = new providers.JsonRpcProvider('http://localhost:8545');

    // this.contract = PocketFaucet__factory.connect(
    //   process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    //   this.provider,
    // );

    const contract = new Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      PocketFaucet.abi as any,
      this.provider,
    );

    contract.on(
      contract.filters['childAdded(address,address)'](),
      (parentAddress, childAddress) => {
        this.parentsService.validateChildren(childAddress.toLowerCase());
        // console.log(parentAddress);
        // console.log('child to validate :', childAddress.toLowerCase());
      },
    );
  }

  async sendTransaction(data: SendTransactionDto) {
    const tx = await this.provider.sendTransaction(data.hash);

    await tx.wait().then(() => {
      this.dispatch(data);
    });

    return {
      hash: tx.hash,
      blockHash: tx.blockHash,
    };
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
