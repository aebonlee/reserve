import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ThemeMode, ResolvedTheme, ColorTheme } from '../types';

interface ThemeContextValue {
  theme: ResolvedTheme;
  mode: ThemeMode;
  toggleTheme: () => void;
  colorTheme: ColorTheme;
  setColorTheme: (c: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const getTimeBasedTheme = (): ResolvedTheme => {
  const hour = new Date().getHours();
  return (hour >= 6 && hour < 18) ? 'light' : 'dark';
};

const COLOR_THEMES: readonly ColorTheme[] = ['blue', 'red', 'green', 'purple', 'orange'];

export const ThemeProvider = ({ children }: { children: ReactNode }): React.ReactElement => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('themeMode');
    if (saved === 'light' || saved === 'dark' || saved === 'auto') return saved;
    // Migrate from old 'theme' key
    const legacy = localStorage.getItem('theme');
    if (legacy === 'light' || legacy === 'dark') return legacy;
    return 'auto';
  });

  const [theme, setTheme] = useState<ResolvedTheme>(() => {
    return mode === 'auto' ? getTimeBasedTheme() : mode;
  });

  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const saved = localStorage.getItem('colorTheme');
    return (COLOR_THEMES as readonly string[]).includes(saved ?? '') ? (saved as ColorTheme) : 'blue';
  });

  // Resolve theme from mode (+ time tick for auto)
  useEffect(() => {
    if (mode !== 'auto') {
      setTheme(mode);
      return;
    }
    setTheme(getTimeBasedTheme());
    const interval = setInterval(() => {
      setTheme(getTimeBasedTheme());
    }, 60000);
    return () => clearInterval(interval);
  }, [mode]);

  // Apply dark/light to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Apply color theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-color', colorTheme);
    localStorage.setItem('colorTheme', colorTheme);
  }, [colorTheme]);

  // Persist mode
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    localStorage.removeItem('theme'); // clean legacy
  }, [mode]);

  // Cycle: auto -> light -> dark -> auto
  const toggleTheme = (): void => {
    setMode(prev => {
      if (prev === 'auto') return 'light';
      if (prev === 'light') return 'dark';
      return 'auto';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme, colorTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
