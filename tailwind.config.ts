import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#FFF9FB',
        lavender: {
          light: '#EDE9FE',
          DEFAULT: '#D8B4FE',
        },
        mint: {
          light: '#D1FAE5',
          DEFAULT: '#A7F3D0',
        },
        peach: {
          light: '#FEF3C7',
          DEFAULT: '#FED7AA',
        },
        blush: {
          light: '#FCE7F3',
          DEFAULT: '#FBCFE8',
        },
        sky: {
          light: '#E0F2FE',
          DEFAULT: '#BAE6FD',
        },
        plum: '#3D2C4E',
        sparkle: '#F472B6',
        // Dark theme
        darkBg: '#1A1030',
        darkCard: '#2D1F4E',
        darkBorder: '#4C3575',
      },
      fontFamily: {
        heading: ['Pacifico', 'cursive'],
        body: ['Nunito', 'sans-serif'],
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 5s ease-in-out 1s infinite',
        sparkle: 'sparkle 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'bounce-dot': 'bounceDot 1.2s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        sparkle: {
          '0%': { opacity: '1', transform: 'scale(0) translate(0,0)' },
          '100%': { opacity: '0', transform: 'scale(1) translate(var(--tx), var(--ty))' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0.3' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}
export default config
