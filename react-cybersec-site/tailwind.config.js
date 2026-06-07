/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'github-dark': '#010409',
        'github-dark-secondary': '#161b22',
        'github-border': '#30363d',
        'github-green': '#3fb950',
        'github-red': '#f85149',
        'github-yellow': '#d29922',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['IBM Plex Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
