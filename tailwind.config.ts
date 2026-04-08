import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A',
          light: '#2D4FA3',
          dark: '#162D6E',
        },
        secondary: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        accent: {
          DEFAULT: '#06B6D4',
          light: '#22D3EE',
          dark: '#0891B2',
        },
        brand: {
          bg: '#F8FAFC',
          text: '#0F172A',
          border: '#E2E8F0',
          muted: '#64748B',
        },
        warning: '#F59E0B',
        danger: '#EF4444',
        success: '#22C55E',
      },
      fontFamily: {
        display: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-lg': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        'display-md': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(15,23,42,0.08), 0 1px 2px -1px rgba(15,23,42,0.06)',
        elevated: '0 10px 40px -8px rgba(30,58,138,0.18)',
        signature: '0 10px 40px -15px rgba(30,58,138,0.35)',
      },
      borderRadius: {
        'brand-sm': '6px',
        'brand-md': '10px',
        'brand-lg': '16px',
        'brand-xl': '24px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #1E3A8A 0%, #06B6D4 100%)',
        'gradient-cta': 'linear-gradient(90deg, #10B981 0%, #06B6D4 100%)',
      },
      animation: {
        'pulse-soft': 'pulse-soft 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out both',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.55)' },
          '50%': { boxShadow: '0 0 0 14px rgba(16, 185, 129, 0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
