import { NextResponse } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import { internalPath } from "@/lib/i18n/routing";
import { SHOP_ENABLED, EXTERNAL_SHOP_URL, isShopPath } from "@/lib/shop/config";

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

/* --- Zugangsschutz fürs Backoffice ---------------------------------------

   /admin und die schreibenden /api/admin-Endpunkte standen bis zum Umzug
   offen. Auf der Testdomain war das folgenlos; unter der echten Adresse
   heißt es: Jeder Fremde kann Bilder hochladen, den Hero austauschen und
   Bestände löschen. `Disallow` in der robots.txt ist dagegen wirkungslos —
   es ist eine Bitte an höfliche Crawler, keine Zugangskontrolle.

   Die Prüfung sitzt bewusst HIER und nicht in den einzelnen Routen: Eine
   neue Datei unter app/api/admin/ ist damit vom ersten Commit an geschützt,
   ohne dass jemand daran denken muss. Vergessener Schutz ist die häufigste
   Ursache offener Backoffice-Endpunkte — diese Stelle macht das Vergessen
   unmöglich.

   AUSNAHME: die `/file/`-Routen. Was das Backoffice hochlädt, landet in
   data/uploads/ — also AUSSERHALB von public/ — und wird über
   /api/admin/hero/file/…, /api/admin/gallery/file/… und
   /api/admin/assets/<slug>/file/… wieder ausgeliefert. Genau diese Adressen
   speichern lib/hero/store.js und lib/assets/store.js als Bildquelle der
   ÖFFENTLICHEN Seite. Ein Schutz über alles würde Besuchern den Hero mit
   401 beantworten. Lesender Zugriff auf eine hochgeladene Bilddatei ist
   Website, kein Backoffice; alles andere ist Backoffice.

   Ohne ADMIN_PASSWORD wird in Produktion NICHTS durchgelassen (503). Die
   Alternative — im Zweifel offen — ist genau der Zustand, den diese
   Funktion beseitigt: Ein Deploy ohne gesetzte Variable wäre wieder ein
   offenes Backoffice, und niemand würde es merken. In der Entwicklung
   bleibt der Bereich offen, dort ist er nur über localhost erreichbar.

   Das Passwort wird zur LAUFZEIT gelesen: Im gebauten Middleware-Bundle
   bleibt `process.env.ADMIN_PASSWORD` ein echter Zugriff, Next setzt hier
   nichts zur Build-Zeit ein. Ein Wechsel im Hosting-Panel wirkt deshalb
   nach einem Neustart des Containers, ein Rebuild ist nicht nötig. */

const ADMIN_REALM = 'Basic realm="Maria Maria Backoffice", charset="UTF-8"';

/* Hochgeladene Dateien werden ausgeliefert, nicht verwaltet — siehe oben. */
const UPLOADED_FILE = /^\/api\/admin\/(?:hero|gallery|assets\/[^/]+)\/file\//;

const isBackoffice = (pathname) =>
  pathname === "/admin" ||
  pathname.startsWith("/admin/") ||
  (pathname.startsWith("/api/admin") && !UPLOADED_FILE.test(pathname));

/* Vergleich über die SHA-256-Summe statt Zeichen für Zeichen: Ein direkter
   String-Vergleich bricht beim ersten Unterschied ab und verrät über die
   Antwortzeit, wie viele Zeichen stimmen — und über den Längenvergleich
   davor auch noch die Passwortlänge. Zwei Summen sind immer 32 Byte lang
   und werden immer vollständig durchlaufen. */
async function digest(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return new Uint8Array(buf);
}

async function credentialsMatch(supplied, expected) {
  const [a, b] = await Promise.all([digest(supplied), digest(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function challenge() {
  /* Der Browser zeigt daraufhin seinen eigenen Anmeldedialog. */
  return new NextResponse("Authentifizierung erforderlich.", {
    status: 401,
    headers: {
      "WWW-Authenticate": ADMIN_REALM,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

async function guardBackoffice(request) {
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    if (process.env.NODE_ENV !== "production") return null;
    return new NextResponse("Backoffice ist nicht konfiguriert (ADMIN_PASSWORD fehlt).", {
      status: 503,
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
    });
  }

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return challenge();

  let supplied;
  try {
    /* atob liefert eine Kette aus Byte-Zeichen. Ein Passwort mit Umlaut käme
       darüber als Latin-1 an und passte nie zum UTF-8-Original — genau das,
       was charset="UTF-8" im Realm dem Browser zugesagt hat. */
    const bytes = Uint8Array.from(atob(header.slice(6)), (c) => c.charCodeAt(0));
    supplied = new TextDecoder().decode(bytes);
  } catch {
    /* Kein gültiges Base64 — dieselbe Antwort wie ein falsches Passwort. */
    return challenge();
  }

  const expected = `${process.env.ADMIN_USER || "maria"}:${expectedPassword}`;
  return (await credentialsMatch(supplied, expected)) ? null : challenge();
}

/* Anfragen, die den Proxy nie gesehen haben — der Healthcheck des Containers
   ruft http://127.0.0.1:3000/ direkt auf. Next setzt `x-forwarded-proto` auch
   ohne Proxy auf "http", der Healthcheck bekäme also eine 308 auf ein https,
   das dort nicht lauscht: Der Container gölte als ungesund und würde in eine
   Neustartschleife laufen. Weitergeleitet wird nur öffentlicher Verkehr. */
const INTERNAL_HOST = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;

export async function middleware(request) {
  /* --- HTTPS erzwingen ---------------------------------------------------

     Diese Weiterleitung gehört in den Proxy, kann dort aber nicht zuverlässig
     stehen: Auf dem Server laufen mehrere Projekte hinter EINEM Traefik, und
     Traefik führt für Middlewares einen einzigen globalen Namensraum. Zwei
     Projekte definieren darin `redirect-to-https` unterschiedlich — eines
     zusätzlich mit `permanent=true` —, woraufhin Traefik die Middleware gar
     nicht erst baut und JEDER Router, der sie nennt, ungeladen bleibt. Port 80
     antwortete deshalb mit 404, statt weiterzuleiten. Ein eindeutiger Name im
     Panel behebt das nicht dauerhaft: Coolify erzeugt die Labels bei jedem
     Deploy neu und überschreibt ihn. Hier steht die Regel in der
     Versionsverwaltung und ist von keinem fremden Projekt aushebelbar.

     Drei Bedingungen, jede gegen einen konkreten Fehlschlag:

     NODE_ENV — Next setzt `x-forwarded-proto` AUCH OHNE Proxy, der Dev-Server
     meldet dort schlicht "http". Ohne diese Bedingung leitete die Middleware
     http://localhost:3000 nach https://localhost weiter, wo nichts lauscht;
     die lokale Entwicklung wäre unbenutzbar. Im Produktionsbau ersetzt Next
     den Ausdruck durch eine Konstante, die Prüfung kostet zur Laufzeit nichts.

     /.well-known/ — darüber bestätigt Let's Encrypt die Domain, ausdrücklich
     über HTTP. Eine Weiterleitung ließe die Erneuerung scheitern, und zwar
     erst in 60 Tagen, wenn das Zertifikat abläuft. Traefik fängt den Pfad
     selbst ab, bevor er hier ankommt; die Zeile kostet nichts und macht die
     Absicht unmissverständlich.

     Der Zielhost kommt aus dem Kopf, NICHT aus request.nextUrl: nextUrl trägt
     hinter einem Proxy unter Umständen den internen Namen (gemessen: die
     Weiterleitung zeigte auf https://localhost). Den öffentlichen Namen kennt
     nur der Proxy, und er nennt ihn in x-forwarded-host. Verkettete Werte
     ("a, b") zählen ab dem ersten — er stammt vom äußersten Proxy.

     308 statt 301: erhält die Methode und spricht dieselbe Sprache wie die
     übrigen dauerhaften Weiterleitungen dieser Datei. */
  const firstOf = (value) => value?.split(",")[0].trim();
  const forwardedHost = firstOf(request.headers.get("x-forwarded-host")) || request.headers.get("host");
  if (
    process.env.NODE_ENV === "production" &&
    firstOf(request.headers.get("x-forwarded-proto")) === "http" &&
    forwardedHost && !INTERNAL_HOST.test(forwardedHost) &&
    !request.nextUrl.pathname.startsWith("/.well-known/")
  ) {
    const { pathname, search } = request.nextUrl;
    return NextResponse.redirect(`https://${forwardedHost}${pathname}${search}`, 308);
  }

  /* Steht vor allem anderen: Das Backoffice kennt kein Sprach-Routing, und
     eine ungeprüfte Anfrage soll gar nicht erst weiter nach unten laufen. */
  if (isBackoffice(request.nextUrl.pathname)) {
    const denied = await guardBackoffice(request);
    if (denied) return denied;
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;
  const [, first = ""] = pathname.split("/");
  const crawler = isCrawler(request.headers.get("user-agent"));

  /* --- 0. Der eigene Shop ist stillgelegt: zum Partner-Shop ---

     Steht VOR allen Sprachregeln, damit jede Schreibweise dasselbe Ziel
     bekommt: /shop, /de/shop, /it/shop, /shop#pakete, /shop?sort=bestseller.

     307, nicht 308: Die Weiterleitung beschreibt einen Zustand („die Kasse
     läuft noch nicht"), keinen Umzug. Ein permanenter Code würde sich in
     Browser-Caches und bei Google festsetzen — der eigene Shop wäre nach dem
     Wiederanschalten für Wiederkehrer unerreichbar, ohne dass irgendwer den
     Fehler sähe. Siehe lib/shop/config.js. */
  if (!SHOP_ENABLED && isShopPath(pathname)) {
    return NextResponse.redirect(new URL(EXTERNAL_SHOP_URL), 307);
  }

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
    remember(request, response, first, crawler);
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
  remember(request, response, DEFAULT_LOCALE, crawler);
  return response;
}

/* Die Sprachwahl im Cookie festhalten — außer für Crawler.

   Zwei Gründe, beide praktisch: Ein Crawler verwirft das Cookie ohnehin, es
   erfüllt für ihn keinen Zweck. Und `Set-Cookie` macht eine Antwort für die
   meisten CDNs unspeicherbar — Vercels Edge-Cache legt eine Antwort mit
   diesem Kopf nicht ab. Jede gecrawlte Seite musste damit vom Ursprung
   erzeugt werden, obwohl alle 87 statisch vorgerendert sind. Ausgerechnet
   für Googlebot, dessen gemessene Antwortzeit ins Crawl-Budget und über die
   Core Web Vitals ins Ranking läuft.

   Eine bereits getroffene, ABWEICHENDE Wahl bleibt unangetastet: Wer Italienisch
   gewählt hat und einem deutschen Deep Link folgt, sieht zwar die deutsche
   Seite (geteilte Links werden nie umgebogen), behält aber seine Sprache —
   der nächste Besuch der Startseite führt weiter nach /it. Das Cookie ändert
   sich nur an zwei Stellen: beim allerersten Kontakt (noch keines gesetzt)
   und beim bewussten Klick im Sprachumschalter, der es clientseitig schreibt.
   Stimmen Cookie und besuchte Sprache überein, wird nur die Laufzeit
   verlängert. */
function remember(request, response, locale, crawler) {
  if (crawler) return response;
  const existing = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(existing) && existing !== locale) return response;
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
  matcher: [
    /* 1. Die Storefront — alles, was umgeschrieben werden soll. */
    "/((?!api|admin|_next|img|video|fonts|.*\\.[\\w]+$).*)",
    /* 2./3. Backoffice und seine Endpunkte. Sie sind oben ausgeschlossen und
       werden NICHT umgeschrieben — sie kommen nur deshalb hierher, weil der
       Zugangsschutz sie sehen muss. Ohne diese zwei Zeilen liefe die Prüfung
       in guardBackoffice() für genau die Pfade nie, für die sie geschrieben
       wurde. */
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
