import { UserParent as Parent } from "@lib/prisma";
import { UserChild as Child } from "@lib/prisma";
export * from "./Test.interface";

export interface UserParent extends Parent {
  children: UserChild[];
}

export interface UserChild extends Child {}
