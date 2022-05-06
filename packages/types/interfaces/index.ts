import { UserParent as Parent, UserParentWallet } from "@lib/prisma";
import { UserChild as Child } from "@lib/prisma";
export * from "./Test.interface";

export interface UserParent extends Parent {
  children: UserChild[];
  wallet: UserParentWallet;
}

export interface UserChild extends Child {}
