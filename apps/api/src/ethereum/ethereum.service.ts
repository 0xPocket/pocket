import { Injectable, OnModuleInit } from '@nestjs/common';
import { providers } from 'ethers';
import { ParentsService } from 'src/users/parents/parents.service';
import {
  PocketFaucet,
  PocketFaucet__factory,
} from '@pocket-contract/typechain-types';
import { NotifyService } from 'src/notify/notify.service';

@Injectable()
export class EthereumService implements OnModuleInit {
  provider: providers.JsonRpcProvider;
  contract: PocketFaucet;

  constructor(
    private parentsService: ParentsService,
    private notifyService: NotifyService,
  ) {
    this.provider = new providers.JsonRpcProvider('http://localhost:8545');

    this.contract = PocketFaucet__factory.connect(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      this.provider,
    );
  }

  onModuleInit() {
    this.contract.on(
      this.contract.filters['ChildAdded(address,address)'](),
      (parentAddress, childAddress) => {
        this.parentsService.validateChildren(childAddress.toLowerCase());
        this.notifyService.addAddressToWebhook(childAddress.toLowerCase());
        // console.log(parentAddress);
        // console.log('child to validate :', childAddress.toLowerCase());
      },
    );

    this.contract.on(
      this.contract.filters['FundsAdded(address,uint256,address)'](),
      (parentAddress, amount, childAddress) => {
        // this.parentsService.validateChildren(childAddress.toLowerCase());
        console.log('FUNDS ADDED EVENT');
        // console.log('child to validate :', childAddress.toLowerCase());
      },
    );
  }
}
