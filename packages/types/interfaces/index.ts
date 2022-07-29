import { User, Parent } from "@prisma/client";
import { Child } from "@prisma/client";

export * from "./Test.interface";
export * from "./BackResError.interface";

export interface UserParent extends User {
  type: "Parent";
  parent: Parent | null;
}

export interface UserChild extends User {
  child: Child | null;
}
export * from "./Alchemy.interface";
export * from "./Covalent.interface";
export * from "./AlchemyWebhook.interface";
