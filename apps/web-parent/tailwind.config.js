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
      primary: {
        light: '',
        DEFAULT: 'rgb(13,176,233)',
        dark: 'rgb(10,150,251)',
      },
      dark: {
        DEFAULT: '#0f172a',
        light: '#1e293b',
        lightest: '#334c74',
      },
      bright: '#fff',
      danger: '#FF0000',
      black: '#000',
      white: {
        DEFAULT: '#fff',
        dark: '#f0f9ff',
        darker: '#64748b',
      },
      gray: {
        light: '#cbd5e1',
        lightest: '#f1f5f9',
        DEFAULT: '#64748b',
      },
      transparent: 'transparent',
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
