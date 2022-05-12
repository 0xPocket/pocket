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
      primary: '#FAE59C',
      dark: '#000',
      bright: '#fff',
      danger: '#FF0000',
    },
    extend: {
      fontFamily: {
        raleway: ["'Raleway'", 'sans-serif'],
        bitter: ["'Bitter'", 'serif'],
      },
    },
  },
  plugins: [],
};
