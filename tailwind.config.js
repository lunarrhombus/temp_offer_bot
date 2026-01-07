/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
        'inter-tight': ['var(--font-inter-tight)', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.5715' }],
        base: ['1rem', { lineHeight: '1.5', letterSpacing: '-0.017em' }],
        lg: ['1.125rem', { lineHeight: '1.5', letterSpacing: '-0.017em' }],
        xl: ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.017em' }],
        '2xl': ['1.5rem', { lineHeight: '1.415', letterSpacing: '-0.017em' }],
        '3xl': ['2rem', { lineHeight: '1.3125', letterSpacing: '-0.017em' }],
        '4xl': ['2.5rem', { lineHeight: '1.25', letterSpacing: '-0.017em' }],
        '5xl': ['3.25rem', { lineHeight: '1.2', letterSpacing: '-0.017em' }],
        '6xl': ['3.75rem', { lineHeight: '1.1666', letterSpacing: '-0.017em' }],
        '7xl': ['4.5rem', { lineHeight: '1.1666', letterSpacing: '-0.017em' }],
      },
      animation: {
        'infinite-scroll': 'infinite-scroll 60s linear infinite',
        'infinite-scroll-inverse': 'infinite-scroll-inverse 60s linear infinite',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-50% - 1rem))' },
        },
        'infinite-scroll-inverse': {
          from: { transform: 'translateX(calc(-50% - 1rem))' },
          to: { transform: 'translateX(0)' },
        },
        'slide-up': {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar-hide'),
  ],
};
