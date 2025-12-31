/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2C5DA7",
        primaryDark: "#244f8d",
      },
    },
  },
  plugins: [],
};
