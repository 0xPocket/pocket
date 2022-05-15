// const base = require('config/tailwind.config');
// module.exports = {
//   ...base,
//   content: [...base.content],
// };

module.exports = {
  darkMode: 'class',
  content: [
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      primary: '#fff',
      dark: '#000',
      bright: '#fff',
      danger: '#FF0000',
      pastelBlue: 'rgb(190,255, 242)',
      transparent: 'transparent',
      bgWhite: '#fff',
      bgGray: 'rgb(45,50,55)',
    },
    extend: {
      backgroundImage: {
        'light-radial-herosection':
          'radial-gradient(37.66% 48.2% at 47.64% 52.94%, #BEFFF3 0%, rgba(239, 255, 250, 0) 100%);',
        'dark-radial-herosection':
          'radial-gradient(37.66% 48.2% at 47.64% 52.94%, #BEFFF3 0%, rgba(239, 255, 250, 0) 100%);',
        'gradient-blue-text':
          'linear-gradient(110.59deg, #069EFC 0%, #14F4C9 2.63%, #069EFC 96.85%)',
      },
      fontFamily: {
        raleway: ["'Raleway'", 'sans-serif'],
        bitter: ["'Bitter'", 'serif'],
      },
    },
  },
  plugins: [],
};
