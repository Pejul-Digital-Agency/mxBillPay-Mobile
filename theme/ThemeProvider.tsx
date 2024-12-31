import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { lightColors } from './colors';

interface ThemeContextType {
  dark: boolean;
  colors: typeof lightColors;
  setScheme: (scheme: 'light' | 'dark') => void;
}

const defaultThemeContext: ThemeContextType = {
  dark: false,
  colors: lightColors,
  setScheme: () => {},
};

export const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Always set the theme to light
  const [isDark, setIsDark] = useState(false);

  const defaultTheme: ThemeContextType = {
    dark: isDark,
    colors: lightColors, // Always use lightColors
    setScheme: (scheme: 'light' | 'dark') => setIsDark(scheme === 'dark'),
  };

  return (
    <ThemeContext.Provider value={defaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
