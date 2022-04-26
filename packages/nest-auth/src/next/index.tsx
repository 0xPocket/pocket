import axios from "axios";
import { NestAuthProviders, OAuth2Provider } from "providers/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as PROVIDERS from "../providers";

interface IAuthContext {
  session: any;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn: (id: string) => void;
}

function createCtx<A extends {} | null>() {
  const ctx = createContext<A | undefined>(undefined);
  function useCtx() {
    const c = useContext(ctx);
    if (c === undefined)
      throw new Error("useCtx must be inside a Provider with a value");
    return c;
  }
  return [useCtx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
}

export const [useAuth, AuthContextProvider] = createCtx<IAuthContext>();

function getProvider(providerId: string, providers: NestAuthProviders) {
  return providers.find((provider) => provider.id === providerId);
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

function oAuthSignIn(provider: OAuth2Provider, isPopup: boolean) {
  console.log(`login with ${provider?.name}`);

  const opts = {
    client_id: provider.clientId,
    redirect_uri: provider.redirectUri,
    scope: provider.scope.join(" "),
  };

  const windowOpts = {
    url: `${provider.endpoints.authorization}?${encodeQuery(opts)}`,
    target: isPopup ? "oAuthWindow" : "_blank",
    features: isPopup
      ? "toolbar=no,location=no,status=no,height=800,width=600,left=100"
      : "",
  };

  const popupWindow = window.open(
    windowOpts.url,
    windowOpts.target,
    windowOpts.features
  );

  const storageListener = async () => {
    try {
      if (localStorage.getItem("code")) {
        window.removeEventListener("storage", storageListener);
        console.log(localStorage.getItem("code"));
        console.log(`send code to test/${provider.id}`);
        const test = await axios.post(provider.endpoints.token!, {
          code: localStorage.getItem("code"),
        });
        console.log(test.data);
      }
    } catch (e) {
      window.removeEventListener("storage", storageListener);
    }
  };

  window.addEventListener("storage", storageListener);
}

async function credentialsSignIn(provider: any, data: object) {
  console.log(`login with ${provider?.name} with data : `, data);
  // const test = await axios.post(`${endpoint}/${provider.id}`);
  // console.log(test);
}

function parseProviders(config: NextAuthConfig) {
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

type Strategies = {
  [key: string]: Partial<OAuth2Provider>;
};

interface NextAuthConfig {
  popup?: boolean;
  endpoint?: string;
  strategies: Strategies;
}

interface AuthProviderProps {
  children: React.ReactNode;
  config: NextAuthConfig;
}

export function AuthProvider({ children, config }: AuthProviderProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>();
  const [popup, setPopup] = useState(false);

  const strategies = useMemo(() => {
    return parseProviders(config);
  }, [config]);

  useEffect(() => {
    const currentUrl = window.location.href;
    if (!currentUrl) {
      return;
    }
    const searchParams = new URL(currentUrl).searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (code) {
      localStorage.setItem("code", code);
      window.close();
      setPopup(true);
    } else if (error) {
      window.close();
      setPopup(true);
    }
  }, []);

  const value: IAuthContext = useMemo(
    () => ({
      session: user,
      status: loading ? "loading" : user ? "authenticated" : "unauthenticated",
      signIn: (providerId: string, formData = null) => {
        const provider = getProvider(providerId, strategies);
        if (!provider)
          throw new Error(
            `Provider '${providerId}' not properly configured in next-auth.config.ts`
          );
        setLoading(true);
        if (provider.type === "oauth") {
          oAuthSignIn(provider, !!config.popup);
        } else if (provider.type === "credentials") {
          if (!formData) {
            throw new Error("Missing data for credentials signin");
          }
          credentialsSignIn(provider, formData);
        }
      },
    }),
    [user, loading]
  );

  if (popup) {
    return <div>Loading...</div>;
  }

  return <AuthContextProvider value={value}>{children}</AuthContextProvider>;
}
