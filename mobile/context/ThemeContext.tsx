import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    theme: ThemeMode;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useRNColorScheme();
    const [theme, setTheme] = useState<ThemeMode>(systemColorScheme || 'light');

    useEffect(() => {
        if (systemColorScheme) setTheme(systemColorScheme);
    }, [systemColorScheme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const isDark = theme === 'dark';

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useAppTheme = () => {
    const context = useContext(ThemeContext);
    if (!context)
        throw new Error('useAppTheme must be used within ThemeProvider');
    return context;
};
