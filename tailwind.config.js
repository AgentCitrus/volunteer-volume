/**  tailwind.config.js  */
module.exports = {
    content: ['./client/src/**/*.{js,jsx}'],
    theme: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      extend: {
        colors: {
          brand: {
            50:  '#f4f7fc',
            100: '#e6ebf6',
            200: '#cdd9ee',
            300: '#b2c4e4',
            400: '#8ea8d7',
            500: '#6d8bca',
            600: '#4f6eb4',
            700: '#395594',
            800: '#2e4474',
            900: '#22325a'
          }
        },
        boxShadow: {
          card: '0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)'
        }
      }
    },
    plugins: [require('@tailwindcss/forms')]
  };
  