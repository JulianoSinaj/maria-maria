import { NextResponse } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import { internalPath } from "@/lib/i18n/routing";
import { SHOP_ENABLED, EXTERNAL_SHOP_URL, isShopPath } from "@/lib/shop/config";
import { SITE_URL } from "@/lib/site";

/* Sprach-Routing.

   Die Seiten liegen unter app/[locale]/ — der Router will also immer ein
   Sprachsegment sehen. In der Adressleiste soll Deutsch aber weiterhin ohne
   Präfix stehen, damit die seit 2019 indexierten URLs (/shop,
   /unsere-weine/lugana …) gültig bleiben. Diese Middleware vermittelt:

   1. "/shop"      → intern nach "/de/shop" umgeschrieben (URL bleibt "/shop")
   2. "/it/shop"   → unverändert, das Segment ist schon da
   3. "/de/shop"   → 301 auf "/shop", sonst wäre jede deutsche Seite unter zwei
                     Adressen erreichbar (Duplicate Content)
   4. "/"          → beim allerersten Besuch eines MENSCHEN: Accept-Language
                     entscheidet, ob auf /it, /en oder /cs weitergeleitet wird

   Dazu kommen seit August 2026 zwei Dinge, die vorher woanders standen: die
   offizielle Schreibweise der Domain (www, mit HTTPS) und die Alt-Adressen
   der WordPress-Installation (früher `redirects()` in next.config.js). Beide
   sind hierher gewandert, weil sie sonst NACHEINANDER greifen und damit
   Redirect-Ketten erzeugen — siehe LEGACY_PATHS und canonicalPath(). Jede
   Anfrage bekommt genau eine Antwort mit genau einem Endziel.

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
   ohne Proxy auf "http", der Healthcheck bekäme also eine 301 auf ein https,
   das dort nicht lauscht: Der Container gölte als ungesund und würde in eine
   Neustartschleife laufen. Weitergeleitet wird nur öffentlicher Verkehr. */
const INTERNAL_HOST = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;

/* --- Die eine offizielle Schreibweise der Domain -------------------------

   Beide Formen — mit und ohne www — beantworteten dieselbe Anfrage mit 200.
   Für Google sind das zwei Websites mit identischem Inhalt: Der Ranking-Wert
   eingehender Links verteilt sich auf beide, und welche der beiden im Index
   landet, entscheidet der Crawler selbst. Die Entscheidung gehört uns, und
   sie lautet www (Absprache mit Maria Pia, August 2026).

   Beide Konstanten kommen aus SITE_URL, damit sie nicht gegen die Canonicals
   driften können: Ein Umzug ändert eine Umgebungsvariable, und Weiterleitung
   und Canonical wandern gemeinsam mit. Führt SITE_URL kein www (Vorschau
   unter einer Testdomain, späterer Beschluss zugunsten der nackten Form),
   bleibt APEX_HOST null und dieser ganze Block fällt aus — dann leitet
   nichts irgendwohin, statt in die falsche Richtung zu leiten. */
const CANONICAL_HOST = new URL(SITE_URL).host;
const APEX_HOST = CANONICAL_HOST.startsWith("www.") ? CANONICAL_HOST.slice(4) : null;

/* Der Port gehört nicht zum Namen — "maria-maria.de:8080" ist dieselbe
   Domain wie "maria-maria.de". */
const bareHost = (host) => host.replace(/:\d+$/, "").toLowerCase();

/* Der Code für eine dauerhafte Weiterleitung.

   301, wie im SEO-Audit vom August 2026 ausdrücklich angefordert. Für
   Suchmaschinen sind 301 und 308 gleichwertig — beide vererben das Ranking
   vollständig —, aber 301 ist der Code, den Audit-Werkzeuge und
   Dokumentationen erwarten, und ein Bericht, in dem an dieser Stelle „308"
   steht, kostet eine Rückfrage.

   MIT EINER AUSNAHME, und die ist kein Formalismus: 301 erlaubt dem Client
   ausdrücklich, die Anfrage danach als GET zu wiederholen — der Körper einer
   POST-Anfrage geht dabei verloren. Genau das trifft die schreibenden
   Backoffice-Endpunkte unter /api/admin, die über den Matcher hier
   durchlaufen: Ein Upload, der die nackte Domain erwischt, käme ohne Datei
   an, und zwar ohne Fehlermeldung. Anfragen mit Körper behalten deshalb 308,
   das die Methode garantiert erhält.

   Crawler und Browser fordern Seiten mit GET oder HEAD an — im Bericht steht
   also durchgehend 301. */
const permanentCode = (method) => (method === "GET" || method === "HEAD" ? 301 : 308);

/* --- Adressen aus der Zeit vor diesem System ----------------------------

   Diese Tabelle stand bis August 2026 als `redirects()` in next.config.js.
   Sie ist hierher gewandert, weil Next.js die Weiterleitungen aus der
   Konfiguration VOR der Middleware auswertet — und genau diese Reihenfolge
   erzeugte die Ketten:

     https://maria-maria.de/galerie
       → 308 → /geschichte        (noch auf der nackten Domain)
       → 308 → www/geschichte     (erst hier greift die Host-Regel)

   Deklarativ ist das nicht auflösbar: Die Konfiguration kennt den Host
   nicht, und die Middleware kommt zu spät. Steht beides an EINER Stelle,
   lässt sich das Endziel in einem Rutsch ausrechnen — ein Sprung.

   Der Inhalt ist unverändert. Unter dieser Domain lief bis zum Umzug eine
   WordPress-Installation; deren Adressen sind seit 2019 indexiert, verlinkt
   und weitergegeben. Die dauerhafte Weiterleitung vererbt das Ranking der
   alten Seite an die neue Entsprechung — der einzige Weg, die aufgebaute
   Sichtbarkeit über den Systemwechsel zu retten.

   Zwei alte Seiten haben keinen Eins-zu-eins-Nachfolger:

     /galerie   → /geschichte. Die dreizehn Bilder der alten Bildstrecke
                  leben in der Erzählseite weiter, dort steht dieselbe Marke
                  in Bildern — nur mit Text darum herum.
     Chiaretto  → /unsere-weine. Der Riviera del Garda Classico ist nicht
                  mehr im Sortiment. Eine Weiterleitung auf einen ANDEREN
                  Wein wäre eine Falschauskunft an jeden, der genau diese
                  Flasche gesucht hat; die Kollektion ist die ehrliche
                  Entsprechung und zeigt, was es stattdessen gibt.

   Der Theme-Ballast der alten Installation (/portfolio/*, /sample-page,
   /projects-2) bekommt bewusst KEINE Regel: Diese Seiten hatten nie eigenen
   Inhalt und sollen als 404 aus dem Index fallen. */
const LEGACY_PATHS = new Map([
  ["/home", "/"],
  ["/ueber-uns", "/geschichte"],
  ["/vision", "/geschichte"],
  ["/galerie", "/geschichte"],
  ["/news", "/magazin"],
  ["/primitivo-di-manduria", "/regionen"],
  ["/lugana-doc", "/unsere-weine/lugana"],
  ["/unsere-weine/lugana-doc", "/unsere-weine/lugana"],
  ["/unsere-weine/primitivo-145-2", "/unsere-weine/primitivo-14-5"],
  ["/unsere-weine/primitivo-145-2-old", "/unsere-weine/primitivo-14-5"],
  ["/unsere-weine/primitivo-155", "/unsere-weine/primitivo-15-5"],
  ["/unsere-weine/greco-di-tufo-d-o-c-g", "/unsere-weine/greco-di-tufo"],
  ["/unsere-weine/riviera-del-garda-classico-chiaretto-dop", "/unsere-weine"],
  ["/datenschutzerklaerung", "/datenschutz"],
]);

/* Die Kollektion liegt seit dem Route-Umzug unter /unsere-weine (vorher
   /weine) — Übersicht und alle neun Produktseiten. Als Präfixregel, weil
   der Slug beliebig ist. */
function legacyTarget(path) {
  const exact = LEGACY_PATHS.get(path);
  if (exact) return exact;
  if (path === "/weine") return "/unsere-weine";
  if (path.startsWith("/weine/")) return `/unsere-weine${path.slice("/weine".length)}`;
  return null;
}

/* Der Pfad, auf dem diese Anfrage am Ende landen soll — in einem Schritt,
   nicht in dreien.

   Drei Umformungen, jede für sich harmlos, in Reihe aber eine Kette:

   1. Schrägstrich am Ende. Next.js normalisiert ihn selbst und zwar VOR der
      Middleware; die Zeile ist reine Absicherung für den Fall, dass eine
      Anfrage doch mit "/galerie/" hier ankommt.
   2. Das /de-Präfix ist redundant — Deutsch steht ohne Segment an der
      Wurzel, sonst wäre jede deutsche Seite unter zwei Adressen erreichbar.
   3. Die Alt-Adressen von oben.

   Die Schleife läuft bis zum Fixpunkt, weil Regel 3 auf sich selbst zeigen
   kann: "/weine/lugana-doc" wird erst zu "/unsere-weine/lugana-doc" und
   DANN zu "/unsere-weine/lugana". Über zwei getrennte Regeln in
   next.config.js waren das zwei Sprünge; hier ist es einer. Die Obergrenze
   ist ein Schleifenschutz — trüge die Tabelle je einen Zyklus, bliebe die
   Seite sonst hängen, statt eine Adresse zu weit zu springen. */
function canonicalPath(pathname) {
  let path = pathname.length > 1 ? pathname.replace(/\/+$/, "") || "/" : pathname;

  const [, first = ""] = path.split("/");
  if (first === DEFAULT_LOCALE) path = path.slice(DEFAULT_LOCALE.length + 1) || "/";

  for (let round = 0; round < 4; round++) {
    const next = legacyTarget(path);
    if (!next || next === path) break;
    path = next;
  }
  return path;
}

export async function middleware(request) {
  const { pathname, search } = request.nextUrl;

  /* --- 0. Der eigene Shop ist stillgelegt: zum Partner-Shop ---

     Steht VOR allen Sprach- UND Host-Regeln, damit jede Schreibweise
     dasselbe Ziel bekommt: /shop, /de/shop, /it/shop, /shop#pakete,
     /shop?sort=bestseller.

     Vor der Host-Regel steht er, weil das Ziel eine FREMDE Domain ist. Der
     Umweg über die eigene www-Form wäre reiner Selbstzweck: „maria-maria.de/
     shop" käme sonst erst auf „www.maria-maria.de/shop" und von dort erst
     hinaus — zwei Sprünge auf eine Adresse, die am Ende ohnehin niemandem
     von uns gehört. Von hier ist es einer.

     307, nicht 301: Die Weiterleitung beschreibt einen Zustand („die Kasse
     läuft noch nicht"), keinen Umzug. Ein permanenter Code würde sich in
     Browser-Caches und bei Google festsetzen — der eigene Shop wäre nach dem
     Wiederanschalten für Wiederkehrer unerreichbar, ohne dass irgendwer den
     Fehler sähe. Siehe lib/shop/config.js. */
  if (!SHOP_ENABLED && isShopPath(pathname)) {
    return NextResponse.redirect(new URL(EXTERNAL_SHOP_URL), 307);
  }

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

     Der Statuscode kommt aus permanentCode() — 301 für Seitenaufrufe.

     --- …und dabei gleich die www-Form ---

     Protokoll und Host werden in EINEM Schritt geradegezogen, nicht in zwei.
     Der Unterschied ist messbar: „http://maria-maria.de/geschichte" käme über
     zwei getrennte Regeln erst auf https, dann auf www — eine Redirect-Kette,
     die Screaming Frog meldet und die jedem Besucher eine zusätzliche
     Rundreise kostet. Ein Ziel, ein Sprung.

     Der Pfad bleibt unangetastet, wie vereinbart: /geschichte landet auf
     /geschichte, nicht auf der Startseite. Eine Weiterleitung, die den Pfad
     verliert, ist für das Ranking der Einzelseite dasselbe wie ein 404.

     Die /.well-known/-Ausnahme oben wiegt hier schwerer als beim reinen
     HTTPS-Zwang: Über diesen Pfad bestätigt Let's Encrypt die Domain, und die
     nackte Domain braucht ein eigenes gültiges Zertifikat — sonst scheitert
     der Aufruf schon an der TLS-Warnung, bevor die Weiterleitung greifen
     kann. Die Anfrage darf also gerade NICHT nach www umgebogen werden.

     --- …und dabei gleich den endgültigen Pfad ---

     canonicalPath() rechnet aus, wo die Anfrage am Ende hingehört: ohne
     /de-Präfix, ohne Schrägstrich am Ende, Alt-Adresse aufgelöst. Protokoll,
     Host UND Pfad stehen damit in einer einzigen Antwort. Der bisher
     schlimmste Fall

       http://maria-maria.de/de/weine/lugana-doc

     brauchte über getrennte Regeln vier Sprünge (https, www, /de weg, zwei
     Alt-Regeln nacheinander) und braucht jetzt einen. */
  const firstOf = (value) => value?.split(",")[0].trim();
  const forwardedHost = firstOf(request.headers.get("x-forwarded-host")) || request.headers.get("host");
  const insecure = firstOf(request.headers.get("x-forwarded-proto")) === "http";
  const wrongHost = Boolean(APEX_HOST && forwardedHost && bareHost(forwardedHost) === APEX_HOST);

  /* pathname/search stehen oben, gleich beim Eintritt. */
  const target = canonicalPath(pathname);

  const publicRequest =
    process.env.NODE_ENV === "production" &&
    forwardedHost &&
    !INTERNAL_HOST.test(forwardedHost) &&
    !pathname.startsWith("/.well-known/");

  if (publicRequest) {
    /* Ein Ziel für alle drei Abweichungen. Der Host kommt AUSSCHLIESSLICH
       aus dem Kopf — die Warnung oben gilt für jede Weiterleitung dieser
       Datei, nicht nur für die HTTPS-Regel: Würde hier request.url benutzt,
       trüge die Antwort unter Umständen den internen Containernamen. */
    if (insecure || wrongHost || target !== pathname) {
      const host = wrongHost ? `www.${forwardedHost}` : forwardedHost;
      return NextResponse.redirect(`https://${host}${target}${search}`, permanentCode(request.method));
    }
  } else if (target !== pathname) {
    /* Entwicklung und interne Aufrufe: Es gibt keinen öffentlichen Namen, an
       dem man sich orientieren könnte, also bleibt die Weiterleitung relativ
       zum tatsächlich aufgerufenen Host — localhost zeigt auf localhost und
       nicht auf die Live-Domain. Alt-Adressen und /de-Präfix müssen auch
       hier weiterleiten, sonst prüft niemand je lokal nach, was ein Besucher
       von außen erlebt. */
    return NextResponse.redirect(new URL(`${target}${search}`, request.url), permanentCode(request.method));
  }

  /* robots.txt und sitemap.xml laufen NUR wegen der Host-Regel oben durch
     diese Datei — der Matcher schließt Adressen mit Dateiendung sonst aus.
     Ohne www-Regel hätten die beiden Dateien unter der nackten Domain
     weiterhin mit 200 geantwortet: ausgerechnet die zwei Adressen, mit denen
     jeder Crawler und jedes Audit-Werkzeug beginnt.

     Ab hier wären sie am falschen Platz: Sie kennen kein Sprach-Routing, und
     Regel 1 weiter unten schriebe sie nach /de/robots.txt um — ein 404 für
     die Sitemap-Angabe der gesamten Domain. Deshalb hier hinaus. */
  if (request.nextUrl.pathname === "/robots.txt" || request.nextUrl.pathname === "/sitemap.xml") {
    return NextResponse.next();
  }

  /* Steht vor allem anderen: Das Backoffice kennt kein Sprach-Routing, und
     eine ungeprüfte Anfrage soll gar nicht erst weiter nach unten laufen. */
  if (isBackoffice(request.nextUrl.pathname)) {
    const denied = await guardBackoffice(request);
    if (denied) return denied;
    return NextResponse.next();
  }

  const [, first = ""] = pathname.split("/");
  const crawler = isCrawler(request.headers.get("user-agent"));

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
      /* 307, nicht 301: Die Wahl hängt an Cookie und Browsersprache und darf
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
    /* 4./5. Zwei Dateiendungen, die Regel 1 ausschließt — hier ausdrücklich
       wieder hereingeholt, damit die www-Weiterleitung auch für sie gilt.
       Sie werden ebenfalls nicht umgeschrieben, siehe oben. */
    "/robots.txt",
    "/sitemap.xml",
  ],
};
