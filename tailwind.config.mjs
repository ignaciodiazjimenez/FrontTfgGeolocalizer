export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      /* FUENTE Inter por defecto */
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },

      /* PALETA */
      colors: {
        'primary-light': '#C9D6BD',
        'primary-dark':  '#597D60',
        'accent-dark':   '#2F3E2E',
        'accent-primary': '#B6E388',
        'accent-hover':   '#A0CF79',
      },

      /* ANIMACIONES */
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'  },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)'   },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-sonar': {
          '0%':   { transform: 'scale(1)',   opacity: '0.6' },
          '40%':  { transform: 'scale(1.3)', opacity: '0.4' },
          '80%':  { transform: 'scale(1.6)', opacity: '0'   },
          '100%': { transform: 'scale(1.6)', opacity: '0'   },
        },
      },
      animation: {
        'fade-in-up':  'fade-in-up 0.5s ease-out both',
        'spin-slow':   'spin-slow 4s linear infinite',
        'pulse-sonar': 'pulse-sonar 3s ease-out infinite',
      },
    },
  },
  plugins: [],
};
