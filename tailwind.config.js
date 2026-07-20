/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bordeaux: "#6B0F1A",
        champagne: "#C8B77A",
        ivory: "#F7F4EF",
        stone: "#D9D2C4",
        charcoal: "#1B1B1B",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};
