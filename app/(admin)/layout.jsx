import "../globals.css";
import { Playfair_Display, Montserrat } from "next/font/google";

/* Root-Layout des Backoffice.

   Die zweite Wurzel neben (site)/[locale]/layout.jsx. /admin ist ein
   internes Werkzeug und bleibt bewusst einsprachig deutsch — es liegt daher
   außerhalb des [locale]-Segments und wird von der Middleware gar nicht erst
   angefasst (siehe matcher in middleware.js).

   Fonts und globals.css werden hier wiederholt statt geteilt: Zwei Root-
   Layouts können sich per Definition kein gemeinsames Elternteil teilen. Die
   next/font-Aufrufe erzeugen dieselben Dateien wie in der Storefront, das
   Ergebnis wird also nicht doppelt ausgeliefert — nur die CSS-Variablen
   müssen an beiden <html>-Tags hängen.

   Der Wechsel zwischen Storefront und Admin lädt die Seite neu, weil beide
   Bäume eigene Wurzeln haben. Für ein Backoffice, das man einmal am Tag
   öffnet, ist das kein Preis, der ins Gewicht fällt. */

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "Maria Maria — Administration",
  robots: { index: false, follow: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F4EF",
  viewportFit: "cover",
};

export default function AdminRootLayout({ children }) {
  return (
    <html lang="de" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="font-montserrat">{children}</body>
    </html>
  );
}
