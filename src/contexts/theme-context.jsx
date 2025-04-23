import { createContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";

const initialState = {
    theme: "system",
    setTheme: () => null,
};

export const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-ui-theme", ...props }) {
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem(storageKey) || defaultTheme;
        } catch (error) {
            console.error("Failed to access localStorage:", error);
            return defaultTheme;
        }
    });

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            root.classList.add(systemTheme);

            // Listen for system theme changes
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleSystemThemeChange = (e) => {
                const newSystemTheme = e.matches ? "dark" : "light";
                root.classList.remove("light", "dark");
                root.classList.add(newSystemTheme);
            };

            mediaQuery.addEventListener("change", handleSystemThemeChange);

            // Cleanup listener
            return () => {
                mediaQuery.removeEventListener("change", handleSystemThemeChange);
            };
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    const value = useMemo(() => ({
        theme,
        setTheme: (theme) => {
            try {
                localStorage.setItem(storageKey, theme);
            } catch (error) {
                console.error("Failed to save theme to localStorage:", error);
            }
            setTheme(theme);
        },
    }), [theme, storageKey]);

    return (
        <ThemeProviderContext.Provider
            {...props}
            value={value}
        >
            {children}
        </ThemeProviderContext.Provider>
    );
}

ThemeProvider.propTypes = {
    children: PropTypes.node,
    defaultTheme: PropTypes.string,
    storageKey: PropTypes.string,
};