import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getColors, fonts } from './index';

const THEME_KEY = '@scorecard:themeMode';

const ThemeContext = createContext({
  mode: 'dark',
  colors: getColors('dark'),
  fonts,
  toggle: () => {},
});

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('dark');

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY)
      .then((v) => {
        if (v === 'light' || v === 'dark') setMode(v);
      })
      .catch(() => {});
  }, []);

  const toggle = () => {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem(THEME_KEY, next).catch(() => {});
      return next;
    });
  };

  const value = useMemo(
    () => ({ mode, colors: getColors(mode), fonts, toggle }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
