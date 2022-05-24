import {
  Account,
  UserParent as Parent,
  UserParentWallet,
  Web3Account,
} from "@lib/prisma";
import { UserChild as Child } from "@lib/prisma";
export * from "./Test.interface";

export interface UserParent extends Parent {
  children: UserChild[];
  wallet?: UserParentWallet;
  account: {
    type: "oauth" | "credentials";
  };
}

export interface UserChild extends Child {
  web3Account: Web3Account;
}
