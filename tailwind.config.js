/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Golf-themed color palette
        primary: {
          50: '#f0f9f0',
          100: '#dcf2dc', 
          200: '#b6e4b6',
          300: '#85d185',
          400: '#4fb54f',
          500: '#2d8f2d', // Main golf green
          600: '#1f6b1f',
          700: '#1a5a1a',
          800: '#164716',
          900: '#133813',
        },
        accent: {
          50: '#fef7ec',
          100: '#fdedd3',
          200: '#fbd9a5',
          300: '#f8bd6d',
          400: '#f59332',
          500: '#e67e22', // Golf orange/brown
          600: '#d56b18',
          700: '#b8541a',
          800: '#94401b',
          900: '#783619',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        sand: {
          50: '#fefcf0',
          100: '#fef7d7',
          200: '#fcecaa',
          300: '#f9dc73',
          500: '#f4cc42', // Sand bunker color
          600: '#e8b923',
          700: '#c29c1a',
          800: '#9c7c1b',
        }
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
}