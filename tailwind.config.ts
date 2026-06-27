import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './features/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['var(--font-bebas)', 'sans-serif'],
        barlow: ['var(--font-barlow)', 'sans-serif'],
        garamond: ['var(--font-garamond)', 'serif'],
        cinzel: ['var(--font-cinzel)', 'serif'],
        cormorant: ['var(--font-cormorant)', 'serif'],
      },
      colors: {
        black: '#000000',
        'near-black': '#060606',
        panel: '#0d0d0d',
        'panel-2': '#111111',
        'blue-primary': '#2563eb',
        'blue-bright': '#3b82f6',
        'blue-dim': '#1d4ed8',
        'blue-glow': 'rgba(37,99,235,0.30)',
        'blue-glow-soft': 'rgba(59,130,246,0.12)',
        gold: '#c9a84c',
        'gold-dim': 'rgba(201,168,76,0.15)',
        white: '#ffffff',
        'off-white': '#f0ede8',
        muted: '#787878',
        'muted-2': '#888888',
        'border-default': 'rgba(255,255,255,0.06)',
        'border-blue': 'rgba(37,99,235,0.20)',
        'border-gold': 'rgba(201,168,76,0.18)',
      },
      letterSpacing: {
        'tight-nav': '0.16em',
        'tight-label': '0.2em',
        medium: '0.24em',
        wide: '0.32em',
        wider: '0.36em',
        widest: '0.38em',
      },
      animation: {
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'clip-up': 'clip-up 1s ease-out forwards',
        'fade-in-up': 'fade-in-up 1s ease-out forwards',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.55s cubic-bezier(0.77, 0, 0.175, 1)',
        'slide-out-right': 'slide-out-right 0.55s cubic-bezier(0.77, 0, 0.175, 1)',
        'scroll-slow': 'scroll-slow 22s linear infinite',
        'scale-in': 'scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { filter: 'drop-shadow(0 0 8px rgba(37,99,235,0.4))' },
          '50%': { filter: 'drop-shadow(0 0 16px rgba(59,130,246,0.85))' },
        },
        'glow-pulse': {
          '0%, 100%': {
            'text-shadow': '0 0 10px rgba(59,130,246,0.3), 0 0 20px rgba(59,130,246,0.1)',
          },
          '50%': {
            'text-shadow': '0 0 20px rgba(59,130,246,0.6), 0 0 40px rgba(59,130,246,0.2)',
          },
        },
        'clip-up': {
          from: { 'clip-path': 'inset(100% 0 0 0)' },
          to: { 'clip-path': 'inset(0 0 0 0)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(100%)' },
        },
        'scroll-slow': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'scale-in': {
          from: { transform: 'scale(0.8)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
