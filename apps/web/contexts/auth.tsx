import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useAxios } from '../hooks/axios';

interface User {
  id: string;
  email?: string;
}

type OAuthProvider = 'google';

interface IAuthContext {
  access_token?: string;
  user?: User;
  loading: boolean;
  login: () => void;
  oAuthLogin: (provider: OAuthProvider) => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({
  loading: true,
  login: () => {},
  oAuthLogin: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);
  const [cookies, setCookie] = useCookies();
  const router = useRouter();
  const axios = useAxios();

  useEffect(() => {
    axios
      .get('/users/me')
      .then((res) => {
        setUser({
          id: res.data.userId,
        });
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((err) => {
        logout();
      });
  }, [axios]);

  const login = () => {};

  const oAuthLogin = (provider: OAuthProvider) => {
    if (router.asPath !== '/login')
      setCookie('auth.redirect_url', router.asPath);
    router.push('/api/auth/' + provider);
  };

  const logout = () => {
    axios
      .post('/auth/logout')
      .then(() => {
        setUser(undefined);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        oAuthLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
