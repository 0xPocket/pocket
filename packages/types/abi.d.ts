import "abitype";
import { Address } from "abitype";
import "ethers";
import type { BigNumber, BigNumberish } from "ethers";

declare module "abitype" {
  export interface Config {
    AddressType: string;
    BytesType: string;
  }
}

declare module "ethers" {
  export interface ContractTransaction {
    hash: Address;
  }
}
