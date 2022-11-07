import 'abitype';
import 'ethers';
import type { BigNumber } from 'ethers';

declare module 'abitype' {
  export interface Config {
    BigIntType: BigNumber;
    AddressType: string;
    BytesType: string;
  }
}

declare module 'ethers' {
  export interface ContractTransaction {
    hash: `0x${string}`;
  }
}
