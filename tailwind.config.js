/** @type {import('tailwindcss').Config} */

import tailwindprime from 'tailwindcss-primeui'
import tailwindtypography from '@tailwindcss/typography'

export default {
  content: ['./index.html', './src/**/*.{js,ts,vue}'],
  theme: {
    extend: {},
  },
  plugins: [tailwindprime, tailwindtypography],
  darkMode: ['selector', '[class="dark-mode"]'],
}
