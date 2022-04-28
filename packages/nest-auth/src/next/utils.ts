import { NestAuthProviders, OAuth2Provider } from "../providers";
import { createContext, useContext } from "react";
import * as PROVIDERS from "../providers";
import { NextAuthConfig } from ".";

export function createCtx<A extends {} | null>() {
  const ctx = createContext<A | undefined>(undefined);
  return [ctx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
}

export function encodeQuery(queryObject: {
  [key: string]: string | number | boolean | undefined;
}): string {
  return Object.entries(queryObject)
    .filter(([_key, value]) => typeof value !== "undefined")
    .map(
      ([key, value]) =>
        encodeURIComponent(key) +
        (value != null ? "=" + encodeURIComponent(value) : "")
    )
    .join("&");
}

function now() {
  return Math.floor(Date.now() / 1000);
}

export function parseProviders(config: NextAuthConfig) {
  const strategies: NestAuthProviders = [];

  for (const key in config.strategies) {
    const strategyOptions = config.strategies[key];
    if (!PROVIDERS[key]) {
      continue;
    }
    const strategy: OAuth2Provider = PROVIDERS[key](strategyOptions);

    if (config.endpoint) {
      strategy.endpoints.token = `${config.endpoint}/${strategy.id}`;
    }
    strategies.push(strategy);
  }
  return strategies;
}

export interface BroadcastMessage {
  event: "code" | "token";
  data?: any;
  clientId: string;
  timestamp: number;
}

/**
 * Inspired by [Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
 * Only not using it directly, because Safari does not support it.
 *
 * https://caniuse.com/?search=broadcastchannel
 */

export function BroadcastChannel(name = "nestauth.message") {
  return {
    /** Get notified by other tabs/windows. */
    receive(onReceive: (message: BroadcastMessage) => void) {
      const handler = (event: StorageEvent) => {
        console.log(event);

        if (event.key !== name) return;
        const message: BroadcastMessage = JSON.parse(event.newValue ?? "{}");
        // if (message?.event !== "session" || !message?.data) return;

        onReceive(message);
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
    /** Notify other tabs/windows. */
    post(message: Record<string, unknown>) {
      if (typeof window === "undefined") return;
      localStorage.setItem(
        name,
        JSON.stringify({ ...message, timestamp: now() })
      );
    },
  };
}
