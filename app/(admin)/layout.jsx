import "../globals.css";
import "./admin.css";
import { Playfair_Display, Montserrat } from "next/font/google";
import { cookies } from "next/headers";
import { AdminI18nProvider } from "@/components/admin/i18n/AdminI18n";
/* cookie helpers come from the plain dictionary module — a function exported
   from a "use client" file reaches a server component as a client-reference
   proxy, not something callable */
import {
  ADMIN_DEFAULT_LOCALE,
  ADMIN_LOCALE_META,
  ADMIN_LOCALE_COOKIE,
  isAdminLocale,
} from "@/components/admin/i18n/dictionary";
import { AdminThemeProvider } from "@/components/admin/theme/AdminTheme";
import { ADMIN_THEME_COOKIE, isAdminTheme } from "@/components/admin/theme/config";

/* Root-Layout des Backoffice.

   Die zweite Wurzel neben (site)/[locale]/layout.jsx. /admin liegt außerhalb
   des [locale]-Segments und wird von der Middleware gar nicht erst angefasst
   (siehe matcher in middleware.js).

   Die Sprache des Backoffice (DE / IT / EN) ist eine persönliche Einstellung
   der Redaktion, keine URL: Sie steht in einem eigenen, auf /admin
   beschränkten Cookie und wird hier gelesen, damit schon der erste Paint in
   der gewählten Sprache erscheint. Mit der Storefront-Locale (mm_locale) hat
   sie nichts zu tun.

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
  const jar = cookies();
  const remembered = jar.get(ADMIN_LOCALE_COOKIE)?.value;
  const locale = isAdminLocale(remembered) ? remembered : ADMIN_DEFAULT_LOCALE;
  const htmlLang = ADMIN_LOCALE_META[locale]?.html ?? locale;

  /* Farbschema: „light“ / „dark“ landen als data-Attribut am <html>, damit
     schon der erste Paint stimmt. „auto“ (oder kein Cookie) setzt KEIN
     Attribut — dann entscheidet prefers-color-scheme in admin.css, und ein
     Wechsel des Gerätethemas greift ohne Reload. Siehe theme/AdminTheme.jsx. */
  const theme = jar.get(ADMIN_THEME_COOKIE)?.value;
  const themeMode = isAdminTheme(theme) ? theme : undefined;
  const themeAttr = themeMode && themeMode !== "auto" ? themeMode : undefined;

  return (
    <html
      lang={htmlLang}
      data-admin-theme={themeAttr}
      className={`${playfair.variable} ${montserrat.variable}`}
    >
      <body className="font-montserrat">
        <AdminThemeProvider initialMode={themeMode}>
          <AdminI18nProvider initialLocale={locale}>{children}</AdminI18nProvider>
        </AdminThemeProvider>
      </body>
    </html>
  );
}
