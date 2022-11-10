import { initTRPC } from "@trpc/server";

import { transformer } from "../transformer";
import type { Context } from "./context";

export const t = initTRPC.context<Context>().create({
  transformer,
  errorFormatter({ shape }) {
    return shape;
  },
});
