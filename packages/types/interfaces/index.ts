import { Account, UserParent as Parent, Web3Account } from "@lib/prisma";
import { UserChild as Child } from "@lib/prisma";
export * from "./Test.interface";
export * from "./BackResError.interface";

export interface UserParent extends Parent {
  children: UserChild[];
  account: {
    type: "oauth" | "credentials";
  };
}

export interface UserChild extends Child {
  web3Account: Web3Account;
}

export * from "./Covalent.interface";
