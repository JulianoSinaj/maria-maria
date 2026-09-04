/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Verification builds set MM_DIST_DIR to an isolated directory so they
     never contend with dev servers writing .next — this machine tends to run
     several (IDE-supervised + sessions). Unset, everything behaves as stock. */
  ...(process.env.MM_DIST_DIR ? { distDir: process.env.MM_DIST_DIR } : {}),
  /* Den Schrägstrich am Ende räumt die Middleware weg, nicht Next.js.

     Next.js normalisiert ihn sonst selbst — und zwar VOR der Middleware.
     Genau das erzeugte eine Kette an der Stelle, an der sie am teuersten
     ist: WordPress hängt in seiner Standard-Einstellung an JEDE Adresse
     einen Schrägstrich, die seit 2019 indexierten Alt-Adressen lauten also
     „/galerie/" und nicht „/galerie".

       https://maria-maria.de/galerie/
         → 308 → /galerie              (Next, noch auf der nackten Domain)
         → 308 → www/geschichte        (erst jetzt Middleware)

     Mit diesem Schalter sieht die Middleware den Schrägstrich selbst und
     rechnet ihn in canonicalPath() zusammen mit Präfix, Alt-Adresse und Host
     in EIN Ziel. Aus zwei Sprüngen wird einer.

     Das Verhalten nach außen ändert sich nicht: Adressen mit Schrägstrich
     leiten weiterhin dauerhaft auf die Fassung ohne — nur eben an einer
     Stelle, die auch den Host kennt. */
  skipTrailingSlashRedirect: true,
  /* instrumentation.js — läuft einmal beim Start des Serverprozesses und
     erledigt zwei Dinge des Shop-Abgleichs: die gepflegten Produkt-Handles
     in die Auflösung von shopHref() hängen und den nächtlichen Lauf stellen.
     In Next 14 steht der Aufruf noch hinter diesem Schalter; ab Next 15 ist
     er Standard und die Zeile kann ersatzlos weg. */
  experimental: {
    instrumentationHook: true,
  },
  /* KEINE redirects() mehr an dieser Stelle.

     Die Weiterleitungen der alten WordPress-Adressen standen bis August 2026
     hier. Next.js wertet sie VOR der Middleware aus — und genau daraus
     entstanden die Redirect-Ketten, die der Screaming-Frog-Lauf gemeldet hat:
     Die Konfiguration korrigierte den Pfad, ohne den Host zu kennen, und die
     Middleware korrigierte anschliessend den Host ein zweites Mal.

     Deklarativ war das nicht zu beheben. Beide Regeln stehen deshalb jetzt
     gemeinsam in middleware.js (LEGACY_PATHS, canonicalPath) und ergeben ein
     einziges Ziel in einer einzigen Antwort.

     Wer hier wieder eine Regel einträgt, baut die Kette neu auf. Neue
     Weiterleitungen gehören in die Tabelle in middleware.js. */
  async headers() {
    /* Die Dateinamen unter /img und /video sind NICHT content-gehasht
       (hero-1280.webp bleibt hero-1280.webp, auch wenn das Motiv wechselt).
       Ein `immutable`-Jahr würde wiederkehrende Besucher bis zu einem Jahr
       auf dem alten Bild festnageln — daher ein Tag Frische plus eine Woche
       stale-while-revalidate: Zweitaufrufe bleiben sofort da, Änderungen
       kommen trotzdem zeitnah an. */
    const media = { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" };

    /* Vorschau-Instanzen (Vercel-Preview, NEXT_PUBLIC_NOINDEX=1) bekommen
       zusätzlich zum <meta name="robots"> aus dem Root-Layout den HTTP-Header
       auf JEDER Antwort — auch auf Bildern, Sitemap und robots.txt, die
       keinen <head> haben (Homepage-Brief §2/§7: noindex, nofollow,
       noarchive). Dieselbe Regel wie INDEXABLE in lib/site.js; hier
       wiederholt, weil next.config.js CommonJS ist und lib/site.js ein
       ES-Modul. Beide Variablen stehen zur Build-Zeit fest. */
    const preview = process.env.NEXT_PUBLIC_NOINDEX === "1" || process.env.VERCEL_ENV === "preview";
    const noindex = { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" };

    return [
      { source: "/img/:path*", headers: [media] },
      { source: "/video/:path*", headers: [media] },
      ...(preview ? [{ source: "/:path*", headers: [noindex] }] : []),
    ];
  },
  webpack(config, { dev }) {
    if (dev) {
      /* data/ holds runtime state written by the admin APIs (mock uploads).
         It lives in the project root, so the dev watcher would otherwise
         recompile — and on Windows occasionally crash-restart the server —
         every time a request writes a file. Runtime data is not source. */
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          ...(Array.isArray(config.watchOptions?.ignored) ? config.watchOptions.ignored : []),
          "**/data/**",
        ],
      };
    }
    return config;
  },
};

module.exports = nextConfig;
