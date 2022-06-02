import axios from "axios";
import {
  NestAuthProviders,
  OAuth2Provider,
  CredentialsProvider,
} from "providers/types";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  BroadcastChannel,
  createCtx,
  encodeQuery,
  parseProviders,
} from "./utils";
import { EventEmitter } from "events";
import { NestAuthTokenPayload, NestAuthUser } from "../";

const broadcast = BroadcastChannel();
const emitter = new EventEmitter();

interface IAuthContext<T = NestAuthUser> {
  user: T | undefined;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn: (id: string, formData?: object) => Promise<void>;
  signOut: () => Promise<void>;
}

const [AuthContext, AuthContextProvider] = createCtx<IAuthContext<any>>();

interface UseAuthConfig {
  redirectTo?: string;
}

export function useAuth<T = NestAuthUser>(
  config: UseAuthConfig | undefined = undefined
) {
  const c = useContext<IAuthContext<T> | undefined>(AuthContext);
  if (c === undefined)
    throw new Error("useCtx must be inside a Provider with a value");

  useEffect(() => {
    if (
      c.status === "unauthenticated" &&
      config?.redirectTo &&
      window.location.href !== config.redirectTo
    ) {
      window.location.href = config.redirectTo;
    }
  }, [c.status]);

  return c;
}

function getProvider(providerId: string, providers: NestAuthProviders) {
  return providers.find((provider) => provider.id === providerId);
}

function oAuthSignIn(
  provider: OAuth2Provider,
  isPopup: boolean,
  session: boolean = false
) {
  console.log(`login with ${provider?.name}`);

  const opts = {
    client_id: provider.clientId,
    redirect_uri: provider.redirectUri,
    scope: provider.scope.join(" "),
    response_type: "code",
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
        .post<NestAuthTokenPayload>(provider.endpoints.token!, {
          code: msg.data.code,
        })
        .then((res) => {
          if (session) emitter.emit("session", true);
          else emitter.emit("access_token", res.data.access_token);
          unsubscribe();
        });
    }
  });
}

async function credentialsSignIn(
  provider: CredentialsProvider,
  data: object,
  session = false
) {
  console.log(`login with ${provider?.name} with data : `, data);
  await axios.post(provider.endpoints.token, data).then((res) => {
    if (session) emitter.emit("session", true);
    else emitter.emit("access_token", res.data.access_token);
  });
  // console.log(test);
}

type Strategies = {
  [key: string]: Partial<OAuth2Provider>;
};

export interface NextAuthConfig {
  popup?: boolean;
  endpoint?: string;
  strategies: Strategies;
  session?: {
    logout: string;
  };
}

interface AuthProviderProps {
  children: React.ReactNode;
  config: NextAuthConfig;
}

export function AuthProvider({ children, config }: AuthProviderProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<NestAuthUser>();
  const [popup, setPopup] = useState(false);

  const strategies = useMemo(() => {
    return parseProviders(config);
  }, [config]);

  const getUser = useCallback(
    (token: string) => {
      const conf = config.session
        ? {
            withCredentials: true,
          }
        : {
            headers: { Authorization: "Bearer " + token },
          };
      axios
        .get("/api/auth/parents/me", conf)
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    },
    [config]
  );

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
    const fetch =
      localStorage.getItem("access_token") || localStorage.getItem("logged_in");

    if (fetch) {
      getUser(fetch);
    } else {
      setLoading(false);
    }
  }, []);

  if (!config.session) {
    useEffect(() => {
      emitter.on("access_token", (token: string) => {
        localStorage.setItem("access_token", token);
        getUser(token);
      });

      return () => {
        emitter.removeAllListeners("access_token");
      };
    }, []);
  } else {
    useEffect(() => {
      emitter.on("session", (token: string) => {
        localStorage.setItem("logged_in", token);
        getUser(token);
      });

      return () => {
        emitter.removeAllListeners("session");
      };
    }, []);
  }

  const value: IAuthContext = useMemo(
    () => ({
      user: user,
      status: loading ? "loading" : user ? "authenticated" : "unauthenticated",
      signIn: async (providerId: string, formData = undefined) => {
        const provider = getProvider(providerId, strategies);
        if (!provider)
          throw new Error(
            `Provider '${providerId}' not properly configured in next-auth.config.ts`
          );
        setLoading(true);
        if (provider.type === "oauth") {
          return oAuthSignIn(provider, !!config.popup, !!config.session);
        } else if (provider.type === "credentials") {
          if (!formData) {
            throw new Error("Missing data for credentials signin");
          }
          return credentialsSignIn(
            provider,
            formData,
            !!config.session
          ).finally(() => setLoading(false));
        }
      },
      signOut: async () => {
        if (config.session) {
          localStorage.removeItem("logged_in");
          return axios.post(config.session.logout).then(() => {
            setUser(undefined);
            return;
          });
        } else {
          localStorage.removeItem("access_token");
          setUser(undefined);
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
