/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#13ec5b",
        "background-light": "#f6f7f8",
        "background-dark": "#111821",
        "player-blue": "#1d4ed8",
        "player-red": "#be123c",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        'large': '2.5rem',
      }
    },
  },
  plugins: [],
}
