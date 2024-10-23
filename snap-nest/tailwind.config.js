import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      width: {
        '104': '26rem',
      },
    },
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: ["retro"]
  }
}