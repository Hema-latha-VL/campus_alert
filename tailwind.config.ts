import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // AlertHub custom colors
        teal: {
          50: "hsl(168 80% 96%)",
          100: "hsl(168 80% 90%)",
          200: "hsl(168 80% 80%)",
          300: "hsl(168 80% 65%)",
          400: "hsl(168 80% 50%)",
          500: "hsl(168 80% 40%)",
          600: "hsl(168 80% 32%)",
          700: "hsl(168 80% 25%)",
          800: "hsl(168 80% 18%)",
          900: "hsl(168 80% 12%)",
        },
        cyan: {
          50: "hsl(187 85% 96%)",
          100: "hsl(187 85% 90%)",
          200: "hsl(187 85% 80%)",
          300: "hsl(187 85% 65%)",
          400: "hsl(187 85% 53%)",
          500: "hsl(187 85% 43%)",
          600: "hsl(187 85% 35%)",
          700: "hsl(187 85% 28%)",
          800: "hsl(187 85% 20%)",
          900: "hsl(187 85% 13%)",
        },
        coral: {
          50: "hsl(25 95% 96%)",
          100: "hsl(25 95% 90%)",
          200: "hsl(25 95% 80%)",
          300: "hsl(25 95% 68%)",
          400: "hsl(25 95% 58%)",
          500: "hsl(25 95% 53%)",
          600: "hsl(25 95% 45%)",
          700: "hsl(25 95% 38%)",
          800: "hsl(25 95% 30%)",
          900: "hsl(25 95% 22%)",
        },
        slate: {
          50: "hsl(215 25% 98%)",
          100: "hsl(215 25% 93%)",
          200: "hsl(215 25% 85%)",
          300: "hsl(215 25% 70%)",
          400: "hsl(215 25% 55%)",
          500: "hsl(215 25% 40%)",
          600: "hsl(215 25% 30%)",
          700: "hsl(215 25% 22%)",
          800: "hsl(215 25% 15%)",
          900: "hsl(215 25% 10%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["4rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-md": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
      boxShadow: {
        glow: "0 0 20px rgba(20, 184, 166, 0.3)",
        "glow-lg": "0 0 40px rgba(20, 184, 166, 0.4)",
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.3)",
        "glow-urgent": "0 0 20px rgba(249, 115, 22, 0.4)",
        glass: "0 4px 24px -1px rgba(0, 0, 0, 0.05), 0 2px 8px -1px rgba(0, 0, 0, 0.03)",
        "glass-lg": "0 8px 40px -4px rgba(0, 0, 0, 0.08), 0 4px 16px -2px rgba(0, 0, 0, 0.04)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-15px) rotate(2deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(20, 184, 166, 0.3)" },
          "50%": { opacity: "0.8", boxShadow: "0 0 40px rgba(20, 184, 166, 0.5)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.4s ease-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-teal": "linear-gradient(135deg, hsl(168 80% 40%) 0%, hsl(187 85% 53%) 100%)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
