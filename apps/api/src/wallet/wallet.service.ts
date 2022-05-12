import { Injectable } from '@nestjs/common';
import { Wallet } from 'ethers';

@Injectable()
export class WalletService {
  generateWallet() {
    const wallet = Wallet.createRandom();
    return {
      publicKey: wallet.address,
      privateKey: wallet.privateKey,
    };
  }
}
