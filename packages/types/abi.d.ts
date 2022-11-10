import { Address } from "abitype";
import type { BigNumber, BigNumberish } from "ethers";

declare module "abitype" {
  export interface Config {
    AddressType: string;
    BytesType: string;
    BigIntType: BigNumber;
  }
}

declare module "ethers" {
  export interface ContractTransaction {
    hash: Address;
  }
}
