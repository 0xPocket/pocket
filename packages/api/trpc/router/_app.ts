import { t } from "../trpc";
import { childRouter } from "./child";
import { connectRouter } from "./connect";
import { contactRouter } from "./contact";
import { emailRouter } from "./email";
import { parentRouter } from "./parent";
import { registerRouter } from "./register";
import { relayerRouter } from "./relayer";
import { ticketRouter } from "./ticket";
import { tokenRouter } from "./token";

/**
 * This is the main router
 */

export const appRouter = t.router({
  child: childRouter,
  connect: connectRouter,
  contact: contactRouter,
  email: emailRouter,
  parent: parentRouter,
  register: registerRouter,
  relayer: relayerRouter,
  token: tokenRouter,
  ticket: ticketRouter,
});

export type AppRouter = typeof appRouter;
