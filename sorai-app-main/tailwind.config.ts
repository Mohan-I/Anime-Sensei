import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "var(--color-primary)",
                    hover: "var(--color-primary-hover)",
                    light: "var(--color-primary-light)",
                    gradient: "var(--color-primary-gradient)",
                },
                background: "var(--color-background)",
                surface: {
                    DEFAULT: "var(--color-surface)",
                    alt: "var(--color-surface-alt)",
                },
                "text-primary": "var(--color-text-primary)",
                "text-secondary": "var(--color-text-secondary)",
                border: "var(--color-border)",
                error: "var(--color-error)",
                success: "var(--color-success)",
                "surface-hover": "var(--color-surface-hover)",
            },
            borderRadius: {
                card: "12px",
                button: "8px",
                modal: "16px",
            },
            fontFamily: {
                sans: ["var(--font-nunito-sans)", "system-ui", "-apple-system", "sans-serif"],
                heading: ["var(--font-bebas-neue)", "sans-serif"],
                logo: ["var(--font-marck-script)", "cursive"],
            },
            maxWidth: {
                container: "1440px",
            },
            animation: {
                "skeleton-pulse": "skeleton-pulse 1.5s ease-in-out infinite",
            },
            keyframes: {
                "skeleton-pulse": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.4" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
