import {
  Account,
  User,
  UserParent as Parent,
  Web3Account,
} from "@prisma/client";
import { Child } from "@prisma/client";

export * from "./Test.interface";
export * from "./BackResError.interface";

export interface UserParent extends User {
  type: "Parent";
  parent: Parent;
}

export interface UserChild extends User {
  child: Child | null;
}

export * from "./Covalent.interface";
export * from "./AlchemyWebhook.interface";
