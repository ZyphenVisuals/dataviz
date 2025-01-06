/** @type {import('tailwindcss').Config} */

import tailwindprime from 'tailwindcss-primeui'

export default {
  content: ['./index.html', './src/**/*.{js,ts,vue}'],
  theme: {
    extend: {},
  },
  plugins: [tailwindprime],
}
