/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  /* hover: styles only on devices that can hover — taps on touch screens no
     longer trigger sticky half-finished hover states (fills, lifts, flips) */
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        bordeaux: "#6B0F1A",
        "bordeaux-deep": "#43090F",
        wine: "#8A2B2F",
        champagne: "#C8B77A",
        "champagne-light": "#E3D9B8",
        /* dunkleres Gold für kleine Versalzeilen auf Creme (Cover Story) */
        "champagne-deep": "#A08A4F",
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
        /* vineyard-foliage green — dark enough for text on ivory */
        vine: "#55683F",
        /* Flaschenglas: die dunkle Stufe von `vine`, trägt helle Schrift */
        "vine-deep": "#3D4B2D",
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
        /* card shadows removed — kept as tokens so every `shadow-luxe` /
           `shadow-lift` (incl. hover transitions) resolves to a flat surface */
        luxe: "none",
        lift: "none",
        glass: "inset 0 1px 0 rgba(255,255,255,.65), 0 20px 50px -20px rgba(43,20,14,.28)",
        chip: "inset 0 1px 0 rgba(255,255,255,.7), 0 10px 24px -12px rgba(107,15,26,.28)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        400: "400ms",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        /* Blätterhinweis des Magazins: ein Tropfen wandert die Linie hinab */
        cue: {
          "0%": { transform: "translateY(-120%)", opacity: "0" },
          "20%": { opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { transform: "translateY(300%)", opacity: "0" },
        },
        /* Siegelring zwischen den Seelen-Karten: eine sehr langsame Umdrehung */
        seal: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        marquee: "marquee 46s linear infinite",
        aura: "aura 36s ease-in-out infinite",
        aura2: "aura2 44s ease-in-out infinite",
        cue: "cue 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        seal: "seal 30s linear infinite",
      },
    },
  },
  plugins: [],
};
