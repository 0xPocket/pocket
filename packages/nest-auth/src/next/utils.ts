import { createContext, useContext } from "react";

export function createCtx<A extends {} | null>() {
  const ctx = createContext<A | undefined>(undefined);
  function useCtx() {
    const c = useContext(ctx);
    if (c === undefined)
      throw new Error("useCtx must be inside a Provider with a value");
    return c;
  }
  return [useCtx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
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

export function now() {
  return Math.floor(Date.now() / 1000);
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
