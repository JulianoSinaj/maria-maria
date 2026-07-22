/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bordeaux: "#6B0F1A",
        "bordeaux-deep": "#43090F",
        wine: "#8A2B2F",
        champagne: "#C8B77A",
        "champagne-light": "#E3D9B8",
        ivory: "#F7F4EF",
        cream: "#FBF9F4",
        stone: "#D9D2C4",
        charcoal: "#1B1B1B",
        espresso: "#211511",
        /* Falanghina label accent — teal family from the checkered etiquette */
        "acqua-light": "#C9E8E1",
        acqua: "#45B3A2",
        "acqua-deep": "#23786B",
        "acqua-ink": "#12403A",
        /* wine-in-glass tones for white-wine colour chapters */
        straw: "#E8DC9A",
        "straw-deep": "#D3C56E",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      borderRadius: {
        card: "1.5rem",
        "card-lg": "2rem",
      },
      boxShadow: {
        luxe: "0 1px 2px rgba(43,20,14,.04), 0 24px 60px -28px rgba(43,20,14,.22)",
        lift: "0 2px 6px rgba(43,20,14,.06), 0 36px 80px -28px rgba(43,20,14,.34)",
        glass: "inset 0 1px 0 rgba(255,255,255,.65), 0 20px 50px -20px rgba(43,20,14,.28)",
        chip: "inset 0 1px 0 rgba(255,255,255,.7), 0 10px 24px -12px rgba(107,15,26,.28)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        400: "400ms",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 46s linear infinite",
        aura: "aura 36s ease-in-out infinite",
        aura2: "aura2 44s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
