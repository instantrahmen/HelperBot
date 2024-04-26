const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const postcssColorMod = require('@alexlafroscia/postcss-color-mod-function');

const config = {
  plugins: [
    //Some plugins, like tailwindcss/nesting, need to run before Tailwind,
    tailwindcss(),
    //But others, like autoprefixer, need to run after,
    autoprefixer,
    postcssColorMod,
  ],
};

module.exports = config;
