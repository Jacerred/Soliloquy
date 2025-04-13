const flowbiteReact = require("flowbite-react/plugin/tailwindcss");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", // for Flowbite React
  "./node_modules/flowbite-react/**/*.js", // for base Flowbite
  "./node_modules/flowbite/**/*.js", ".flowbite-react\\class-list.json"],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin'), flowbiteReact],
}