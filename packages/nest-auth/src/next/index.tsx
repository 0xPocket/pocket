import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface IAuthContext {
  session: any;
  status: string;
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

function getProvider(providerId: string, providers: any) {
  return providers.find((provider) => provider.id === providerId);
}

interface NextAuthConfig {
  popup?: boolean;
  authEndpoint: string;
  providers: any;
}

interface AuthProviderProps {
  children: React.ReactNode;
  config: NextAuthConfig;
}

function oAuthSignIn(provider: any, isPopup: boolean, endpoint: string) {
  console.log(`login with ${provider?.name}`);
  if (isPopup) {
    window.open(
      `${provider.authorization}&client_id=${provider.options?.clientId}`,
      "oAuthWindow",
      "height=500,width=500,left=100,top=100"
    );
  } else {
    window.open(
      `${provider.authorization}&client_id=${provider.options?.clientId}`,
      "_blank"
    );
  }

  const storageListener = () => {
    try {
      if (localStorage.getItem("code")) {
        window.removeEventListener("storage", storageListener);
        console.log(localStorage.getItem("code"));
        console.log(`send code to ${endpoint}/${provider.id}`);
      }
    } catch (e) {
      window.removeEventListener("storage", storageListener);
    }
  };

  window.addEventListener("storage", storageListener);
}

async function credentialsSignIn(
  provider: any,
  data: object,
  endpoint: string
) {
  console.log(`login with ${provider?.name} with data : `, data);
  const test = await axios.post(`${endpoint}/${provider.id}`);
  console.log(test);
}

export function AuthProvider({ children, config }: AuthProviderProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>();
  const [popup, setPopup] = useState(false);

  // useEffect for oAuth Popup Window
  useEffect(() => {
    const currentUrl = window.location.href;
    if (!currentUrl) {
      return;
    }
    const searchParams = new URL(currentUrl).searchParams;
    const code = searchParams.get("code");

    if (code) {
      localStorage.setItem("code", code);
      window.close();
      setPopup(true);
    }
  }, []);

  const value: IAuthContext = useMemo(
    () => ({
      session: user,
      status: loading ? "loading" : user ? "authenticated" : "unauthenticated",
      signIn: (providerId: string, formData = null) => {
        const provider = getProvider(providerId, config.providers);
        if (!provider)
          throw new Error(
            `Provider '${provider.id}' not properly configured in next-auth.config.ts`
          );
        if (provider.type === "oauth") {
          oAuthSignIn(provider, !!config.popup, config.authEndpoint);
        } else if (provider.type === "credentials") {
          if (!formData) {
            throw new Error("Missing data for credentials signin");
          }
          credentialsSignIn(provider, formData, config.authEndpoint);
        }
      },
    }),
    [user, loading, config.providers, config.popup, config.authEndpoint]
  );

  if (popup) {
    return <div>Loading...</div>;
  }

  return <AuthContextProvider value={value}>{children}</AuthContextProvider>;
}
