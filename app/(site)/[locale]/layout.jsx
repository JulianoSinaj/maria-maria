import "../../globals.css";
import { Playfair_Display, Montserrat } from "next/font/google";
import { notFound } from "next/navigation";
import SmoothScroll from "@/components/motion/SmoothScroll";
import { MagneticRouteProvider } from "@/components/motion/MagneticContext";
import { CartProvider } from "@/components/shop/CartContext";
import StorefrontChrome from "@/components/StorefrontChrome";
import { I18nProvider } from "@/lib/i18n/context";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LOCALES, LOCALE_META, isLocale } from "@/lib/i18n/config";
import { alternatePaths } from "@/lib/i18n/routing";
import { SITE_URL, SITE_NAME, INDEXABLE, absoluteUrl } from "@/lib/site";

/* Root-Layout der Storefront.

   Es liegt unter (site)/[locale]/ und nicht mehr in app/ — die Seite hat seit
   der Mehrsprachigkeit ZWEI Wurzeln: diese hier und app/(admin)/layout.jsx.
   Grund ist das lang-Attribut: <html lang> muss die tatsächliche Sprache des
   Dokuments nennen (Screenreader wählen danach die Stimme, Suchmaschinen die
   Sprachversion). Ein einzelnes Root-Layout in app/ kennt die Locale aber
   nicht — die steht erst im Segment darunter. Man könnte sie über headers()
   hereinholen, das macht jedoch den gesamten Baum dynamisch und kostet die
   statische Generierung. Zwei Wurzeln über Route-Groups sind der dokumentierte
   Weg und behalten das Pre-Rendering.

   Route-Groups tauchen nicht in der URL auf: (site) und (admin) ändern keinen
   einzigen Pfad. */

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

/* Alle vier Sprachen werden zur Build-Zeit erzeugt … */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/* … und nur diese vier. Ohne den Riegel würde /xx/shop eine leere fünfte
   Sprachversion rendern statt 404 zu liefern. */
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const locale = params.locale;
  if (!isLocale(locale)) return {};

  const dict = await getDictionary(locale);
  const meta = dict.meta ?? {};
  const langs = alternatePaths("/");

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: meta.siteTitle,
      template: `%s — ${SITE_NAME}`,
    },
    description: meta.siteDescription,
    applicationName: SITE_NAME,
    alternates: {
      canonical: langs[locale],
      /* hreflang meldet Google die Geschwister einer Seite. `x-default` zeigt
         auf die deutsche Wurzel — das ist die Version für alle Sprachen, die
         wir nicht führen. */
      languages: {
        ...Object.fromEntries(
          LOCALES.map((l) => [LOCALE_META[l].hreflang, absoluteUrl(langs[l])])
        ),
        "x-default": absoluteUrl("/"),
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: LOCALE_META[locale].ogLocale,
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => LOCALE_META[l].ogLocale),
    },
    twitter: { card: "summary_large_image" },
    /* Vorschau- und Staging-Instanzen bleiben draußen (INDEXABLE in
       lib/site.js). Die Angabe steht hier im Layout und gilt damit für jede
       Seite der Storefront — einzelne Seiten überschreiben sie nur, wenn sie
       robots selbst setzen (404 und Fehlerseite tun das). */
    robots: INDEXABLE
      ? {
          index: true,
          follow: true,
          /* Homepage-Brief §2: „index, follow; max-image-preview:large" —
             im allgemeinen robots-Tag, nicht nur im googlebot-Tag. Ohne die
             Angabe entscheidet Google konservativ: kleines Vorschaubild. Für
             eine Seite, die von Fotografie lebt, ist „large" der Unterschied
             zwischen einer Bildkachel und einer Textzeile in Discover und der
             Bildersuche. */
          "max-image-preview": "large",
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : /* noindex, nofollow, NOARCHIVE — `nocache: true` stand hier vorher und
           rendert in Next.js wörtlich als „nocache", eine Direktive, die kein
           Crawler kennt. Den HTTP-Header X-Robots-Tag mit denselben drei
           Werten setzt next.config.js auf jeder Antwort der Vorschau. */
        { index: false, follow: false, noarchive: true },
    /* Dateien liegen in public/ statt als app/icon.*: Die Storefront hat mit
       (site)/[locale] und (admin) zwei Wurzeln, und ein Icon im dynamischen
       Segment käme als /de/icon.png heraus — vier Adressen für dasselbe
       Symbol. Aus public/ ist es eine, und der Middleware-Matcher lässt
       Pfade mit Dateiendung ohnehin unberührt. */
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    manifest: "/site.webmanifest",
    /* Die Telefonnummer im Impressum und im Footer soll auf iOS nicht
       automatisch zum Link umgebaut werden — Safari setzt dabei eigenes
       Markup mitten in den Text und verändert damit, was Crawler dort
       lesen. Die echten Kontaktlinks sind ohnehin ausgezeichnet. */
    formatDetection: { telephone: false, address: false, email: false },
    /* Search Console und Bing Webmaster Tools verlangen zur Bestätigung des
       Eigentums ein Meta-Tag. Über Umgebungsvariablen statt fest im Code:
       Der Token ist ein Konto-Geheimnis, gehört nicht ins Repository, und
       so lässt sich die Domain bestätigen, ohne dass jemand eine Zeile
       Code anfassen und neu deployen muss. Ohne gesetzte Variable erscheint
       schlicht kein Tag. */
    verification: {
      ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
        ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
        : null),
      ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
        : null),
    },
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F4EF",
  /* lets env(safe-area-inset-*) work on notched phones — the floating cart
     pill, cart summary and mobile menu pad themselves off the home indicator */
  viewportFit: "cover",
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <html lang={LOCALE_META[locale].htmlLang} className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="font-montserrat">
        {/* Kein JSON-LD mehr an dieser Stelle: Unternehmen, Marke und Website
            (lib/seo/jsonLd.js, siteNodes) liefert jede Seite selbst am Anfang
            ihres eigenen Graphen — ein Block je Seite statt zwei
            (Homepage-Brief §7). Die Wiederholung auf jeder Seite, aus der
            Google die Entität hinter der Domain liest, bleibt damit
            erhalten; nur der Ort ist ein anderer. */}
        {/* Der Provider trägt nur Locale + gemeinsamen Rahmen-Text ins
            Client-Bundle. Seitentexte reichen die Server-Components als Prop —
            siehe lib/i18n/context.jsx. */}
        <I18nProvider locale={locale} common={dict.common}>
          <SmoothScroll>
            <MagneticRouteProvider>
              <CartProvider>
                <StorefrontChrome>{children}</StorefrontChrome>
              </CartProvider>
            </MagneticRouteProvider>
          </SmoothScroll>
        </I18nProvider>
      </body>
    </html>
  );
}
