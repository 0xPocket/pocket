import React, { createContext, useContext, useEffect, useState } from 'react';

type IThemeContext = {
  dark: boolean;
  toggleDark: () => void;
};

export function createCtx<A extends {} | null>() {
  const ctx = createContext<A | undefined>(undefined);
  return [ctx, ctx.Provider] as const;
}

const [ThemeContext, ThemeContextProvider] = createCtx<IThemeContext>();

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const lsDark = localStorage.getItem('dark');

    if (
      lsDark === 'true' ||
      (!lsDark && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDark = () => {
    const d = document.documentElement;
    const themes = ['light', 'dark'];

    d.classList.remove(...themes);
    d.classList.add(dark ? 'light' : 'dark');

    localStorage.setItem('dark', JSON.stringify(!dark));
    setDark(!dark);
  };

  return (
    <ThemeContextProvider
      value={{
        dark,
        toggleDark,
      }}
    >
      {children}
    </ThemeContextProvider>
  );
}

export function useTheme() {
  const c = useContext<IThemeContext | undefined>(ThemeContext);
  if (c === undefined)
    throw new Error('useCtx must be inside a Provider with a value');
  return c;
}
