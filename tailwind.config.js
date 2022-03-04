module.exports = {
  enabled: true,
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // class, 'media' or boolean
  theme: {
    extend: {
      colors: {
        gray: '#36382E',
        white: '#EDE6E3',
        truewhite: '#FFFFFF',
        orange: '#F06449',
        blue: '#5BC3EB',
        silver: '#DADAD9',
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
};