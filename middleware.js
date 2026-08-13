import { NextResponse } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import { internalPath } from "@/lib/i18n/routing";

/* Sprach-Routing.

   Die Seiten liegen unter app/[locale]/ — der Router will also immer ein
   Sprachsegment sehen. In der Adressleiste soll Deutsch aber weiterhin ohne
   Präfix stehen, damit die seit 2019 indexierten URLs (/shop,
   /unsere-weine/lugana …) gültig bleiben. Diese Middleware vermittelt:

   1. "/shop"      → intern nach "/de/shop" umgeschrieben (URL bleibt "/shop")
   2. "/it/shop"   → unverändert, das Segment ist schon da
   3. "/de/shop"   → 308 auf "/shop", sonst wäre jede deutsche Seite unter zwei
                     Adressen erreichbar (Duplicate Content)
   4. "/"          → beim allerersten Besuch eines MENSCHEN: Accept-Language
                     entscheidet, ob auf /it, /en oder /cs weitergeleitet wird

   Punkt 4 gilt bewusst nur für die Wurzel und nur ohne gesetztes Cookie. Wer
   einen Deep Link bekommt, landet auf genau der Seite, die im Link steht —
   eine Weiterleitung nach Browsersprache würde geteilte Links umbiegen und
   Crawler in die falsche Sprachversion schicken. */

const LOCALE_COOKIE = "mm_locale";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/* Crawler und Vorschau-Dienste — sie sind von Punkt 4 ausgenommen.

   Der Grund ist ein konkreter Schaden, kein theoretischer. Googlebot crawlt
   aus den USA und hält keine Cookies; für ihn traf bei JEDEM Aufruf von "/"
   der Fall „erster Besuch" zu. Schlimmer: Erkennt Google, dass eine Domain
   nach Accept-Language umleitet, schaltet es auf „locale-adaptive crawling"
   um und ruft dieselbe Adresse mit wechselnden Sprachköpfen ab — die
   deutsche Startseite unter "/" wurde damit womöglich nie als das gecrawlt,
   was sie ist. Ausgerechnet die Seite mit den meisten eingehenden Links,
   dem x-default und dem Canonical der deutschen Fassung.

   Für Vorschau-Dienste gilt dasselbe eine Ebene tiefer: Teilt jemand
   "/" in WhatsApp oder Slack, holte deren Scraper mit eigenem Sprachkopf
   unter Umständen /it ab — der geteilte deutsche Link zeigte dann eine
   italienische Vorschaukarte.

   Das ist KEIN Cloaking. Cloaking hieße, Crawlern anderen Inhalt zu zeigen
   als Menschen; hier bekommen sie exakt das, was auch ein Besucher ohne
   Sprachpräferenz sieht — die deutsche Startseite. Alle vier Sprachen
   bleiben unter ihrer eigenen Adresse erreichbar, verlinkt, in der Sitemap
   und über hreflang miteinander verbunden.

   Das Muster ist absichtlich großzügig, weil beide Fehlerarten mild sind:
   Ein fälschlich als Crawler eingestufter Mensch landet auf der deutschen
   Startseite und schaltet oben um; ein nicht erkannter Crawler verhält sich
   wie bisher. `bot` deckt Googlebot, bingbot, Applebot, GPTBot, ClaudeBot,
   PerplexityBot, Twitterbot, LinkedInBot, Slackbot und Discordbot in einem
   Wort ab. */
const CRAWLER =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|preview|embedly|iframely|lighthouse|pagespeed|headlesschrome|curl\/|wget|python-requests|go-http-client|okhttp|java\//i;

const isCrawler = (userAgent) => Boolean(userAgent) && CRAWLER.test(userAgent);

/* Accept-Language: "cs-CZ,cs;q=0.9,en;q=0.8" → erste Sprache, die wir führen. */
function preferredLocale(header) {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.trim().toLowerCase(), q: q ? Number(q.split("=")[1]) || 0 : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    /* "de-AT" zählt als Deutsch — die Region interessiert uns nicht. */
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return null;
}

export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const [, first = ""] = pathname.split("/");
  const crawler = isCrawler(request.headers.get("user-agent"));

  /* --- 3. Das Default-Präfix ist redundant: dauerhaft auf die kurze URL --- */
  if (first === DEFAULT_LOCALE) {
    const stripped = pathname.slice(DEFAULT_LOCALE.length + 1) || "/";
    const url = new URL(`${stripped}${search}`, request.url);
    /* 308 statt 301: erhält die Methode, und die Redirects in next.config.js
       für /weine → /unsere-weine sprechen dieselbe Sprache. */
    return NextResponse.redirect(url, 308);
  }

  /* --- 2. Bereits eine der drei präfigierten Sprachen: durchlassen --- */
  if (isLocale(first)) {
    const response = NextResponse.next();
    remember(response, first, crawler);
    return response;
  }

  /* --- 4. Startseite ohne Vorgeschichte: nach Browsersprache anbieten ---
     Nur für Menschen. Für Crawler und Vorschau-Dienste fällt dieser Block
     aus, sie laufen weiter nach unten in die deutsche Fassung — siehe die
     Begründung bei CRAWLER. */
  if (pathname === "/" && !crawler) {
    const remembered = request.cookies.get(LOCALE_COOKIE)?.value;
    const choice = isLocale(remembered) ? remembered : preferredLocale(request.headers.get("accept-language"));
    if (choice && choice !== DEFAULT_LOCALE) {
      /* 307, nicht 308: Die Wahl hängt an Cookie und Browsersprache und darf
         niemals im Browser-Cache oder bei einem Proxy festbrennen. */
      return NextResponse.redirect(new URL(`/${choice}${search}`, request.url), 307);
    }
  }

  /* --- 1. Alles andere ist Deutsch: intern umschreiben, URL bleibt kurz --- */
  const url = request.nextUrl.clone();
  url.pathname = internalPath(DEFAULT_LOCALE, pathname);
  const response = NextResponse.rewrite(url);
  remember(response, DEFAULT_LOCALE, crawler);
  return response;
}

/* Die Sprachwahl im Cookie festhalten — außer für Crawler.

   Zwei Gründe, beide praktisch: Ein Crawler verwirft das Cookie ohnehin, es
   erfüllt für ihn keinen Zweck. Und `Set-Cookie` macht eine Antwort für die
   meisten CDNs unspeicherbar — Vercels Edge-Cache legt eine Antwort mit
   diesem Kopf nicht ab. Jede gecrawlte Seite musste damit vom Ursprung
   erzeugt werden, obwohl alle 87 statisch vorgerendert sind. Ausgerechnet
   für Googlebot, dessen gemessene Antwortzeit ins Crawl-Budget und über die
   Core Web Vitals ins Ranking läuft. */
function remember(response, locale, crawler) {
  if (crawler) return response;
  response.cookies.set(LOCALE_COOKIE, locale, { maxAge: COOKIE_MAX_AGE, sameSite: "lax", path: "/" });
  return response;
}

export const config = {
  /* Was hier durchläuft, wird umgeschrieben — also alles ausschließen, was
     kein Storefront-Pfad ist:
       api      – JSON-Endpunkte, einsprachig
       admin    – eigenes Backoffice, bleibt deutsch (eigene Entscheidung)
       _next    – Build-Assets und Bilder-Optimierung
       img/video/fonts – statische Medien aus public/
       Dateien mit Endung (favicon.ico, robots.txt, sitemap.xml, *.webp …) */
  matcher: ["/((?!api|admin|_next|img|video|fonts|.*\\.[\\w]+$).*)"],
};
