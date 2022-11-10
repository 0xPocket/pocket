import { User, Parent } from "@lib/prisma";
import { Child } from "@lib/prisma";

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
export * from "./Ramp.interface";
export * from "./1inch.interface";
