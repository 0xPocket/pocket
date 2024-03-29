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
      bright: {
        bg: 'rgb(237,249,254)',
        DEFAULT: '#fff',
        dark: '#f8ffff',
        darkest: '#b5d8f7',
      },
      danger: 'rgba(197,48,48)',
			success: {
				DEFAULT :'#3deb57',
				dark:'#00be26'
			},
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
			badges: {
				bgblue : 'rgb(195 221 253)',
				textblue: 'rgb(30 66 159)',
				bggreen : 'rgb(188 240 218)',
				textgreen: 'rgb(1 71 55)',
				bgdefaultdark: 'rgb(55 65 81)',
				textdefaultdark: 'rgb(209 213 219)',
				bgdefaultlight: 'rgb(243 244 246)',
				textdefaultlight: 'rgb(31 41 55)',
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
        'gradient-pink-text':
          'linear-gradient(90deg, rgba(224,95,144,1) 0%, rgba(255,138,177,1) 100%)',
      },
      fontFamily: {
        raleway: ["'Raleway'", 'sans-serif'],
        bitter: ["'Bitter'", 'serif'],
      },
    },
  },
  plugins: [],
};
