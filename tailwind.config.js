/** @type {import('tailwindcss').Config} */


const colors = {
  primary: '#001F54',
  lightPrimary: '#0044B8',
  secondary: '#E2E1EF',
  background: '#FFFDF2',
  dark: '#181818',
  danger: '#E9053E',
  success: '#00CA79',
  text: '#1f2937',
}


export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  safelist: [
    'bg-background',
    'bg-primary',
    'bg-light-primary',
    'bg-grady-primary',
    'bg-secondary',
    'bg-light-secondary',
    'bg-grady-secondary',
    'text-background',
    'text-secondary',
    'text-primary',
    'text-text',
  ],
  theme: {
    extend: {
      colors,
      fontFamily: {
        poppins: ['"Poppins"', 'sans-serif'],
      },
      backgroundImage: {
        'grady-primary': `linear-gradient(135deg, ${colors.lightPrimary}, ${colors.primary})`,
        'grady-primary-hover': `linear-gradient(to left top,  ${colors.lightPrimary}, ${colors.primary})`,

        'grady-secondary': `linear-gradient(135deg, ${colors.background}, ${colors.secondary})`,  
        'grady-secondary-hover': `linear-gradient(to left top,  ${colors.background}, ${colors.secondary})`,  
      },

      boxShadow: {
        'primary': `0 0 8px ${colors.lightPrimary}`,
        'secondary': `0 0 8px ${colors.lightPrimary}`,
      }

      // backgroundSize: {
      //   '400': '400% 100%',
      // },

      // animation: {
      //   'shine-on-hover': 'shine 1.5s linear forwards',
      // },
      // keyframes: {
      //   shine: {
      //     '0%': { backgroundPosition: '200% 0%' },
      //     '100%': { backgroundPosition: '0% 0%' },
      //   },
      // },
    },
  },
  plugins: [],
}
