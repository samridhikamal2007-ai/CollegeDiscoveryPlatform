import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('rp_theme');
        if (saved) return saved;
        return 'system';
    });

    const [resolvedTheme, setResolvedTheme] = useState('light');

    useEffect(() => {
        const applyTheme = (t) => {
            const root = document.documentElement;
            if (t === 'dark') {
                root.setAttribute('data-theme', 'dark');
                setResolvedTheme('dark');
            } else {
                root.removeAttribute('data-theme');
                setResolvedTheme('light');
            }
        };

        if (theme === 'system') {
            const mq = window.matchMedia('(prefers-color-scheme: dark)');
            applyTheme(mq.matches ? 'dark' : 'light');
            const handler = (e) => applyTheme(e.matches ? 'dark' : 'light');
            mq.addEventListener('change', handler);
            return () => mq.removeEventListener('change', handler);
        } else {
            applyTheme(theme);
        }
    }, [theme]);

    const setAndSaveTheme = (t) => {
        setTheme(t);
        localStorage.setItem('rp_theme', t);
    };

    const toggleTheme = () => {
        setAndSaveTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            setTheme: setAndSaveTheme,
            resolvedTheme,
            toggleTheme,
            isDark: resolvedTheme === 'dark'
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
};

export default ThemeContext;
