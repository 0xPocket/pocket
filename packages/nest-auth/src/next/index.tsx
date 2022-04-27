import axios from "axios";
import { NestAuthProviders, OAuth2Provider } from "providers/types";
import { useEffect, useMemo, useState } from "react";
import * as PROVIDERS from "../providers";
import { BroadcastChannel, createCtx, encodeQuery } from "./utils";
import { EventEmitter } from "events";

const broadcast = BroadcastChannel();
const emitter = new EventEmitter();

interface IAuthContext {
  session: any;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn: (id: string) => void;
}

export const [useAuth, AuthContextProvider] = createCtx<IAuthContext>();

function getProvider(providerId: string, providers: NestAuthProviders) {
  return providers.find((provider) => provider.id === providerId);
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

  window.open(windowOpts.url, windowOpts.target, windowOpts.features);

  const unsubscribe = broadcast.receive((msg) => {
    if (msg.event === "code" && msg.data.code) {
      axios
        .post(provider.endpoints.token!, {
          code: msg.data.code,
        })
        .then((res) => {
          emitter.emit("access_token", res.data.access_token);
          unsubscribe();
        });
    }
  });
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
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>();
  const [popup, setPopup] = useState(false);

  const strategies = useMemo(() => {
    return parseProviders(config);
  }, [config]);

  /**
   * useEffect when the popup is redirecting to our front-end
   */

  useEffect(() => {
    const currentUrl = window.location.href;
    if (!currentUrl) {
      return;
    }
    const searchParams = new URL(currentUrl).searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (code || error) {
      broadcast.post({ event: "code", data: { code } });
      window.close();
      setPopup(true);
    }
  }, []);

  /**
   * useEffect to get user and listen on access_token change
   */

  useEffect(() => {
    const getUser = (token: string) => {
      axios
        .get("http://localhost:5000/auth/me", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        });
    };

    const token = localStorage.getItem("access_token");

    if (token) {
      getUser(token);
    }

    emitter.on("access_token", (token: string) => {
      localStorage.setItem("access_token", token);
      getUser(token);
    });

    setLoading(false);

    return () => {
      emitter.removeAllListeners("access_token");
    };
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
