/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Verification builds set MM_DIST_DIR to an isolated directory so they
     never contend with dev servers writing .next — this machine tends to run
     several (IDE-supervised + sessions). Unset, everything behaves as stock. */
  ...(process.env.MM_DIST_DIR ? { distDir: process.env.MM_DIST_DIR } : {}),
  /* Die Kollektion liegt seit dem Route-Umzug unter /unsere-weine (vorher
     /weine). Alte Links — Lesezeichen, Suchmaschinen-Index, gedruckte QR-Codes
     — dürfen nicht ins Leere laufen: 308 (permanent) leitet Übersicht und alle
     neun Produktseiten dauerhaft weiter und vererbt das Ranking mit. */
  async redirects() {
    return [
      { source: "/weine", destination: "/unsere-weine", permanent: true },
      { source: "/weine/:slug", destination: "/unsere-weine/:slug", permanent: true },

      /* Unter dieser Domain lief bis zum Umzug eine WordPress-Installation.
         Deren Adressen sind seit 2019 indexiert, verlinkt und weitergegeben —
         sie dürfen nicht ins Leere laufen, nur weil darunter jetzt ein anderes
         System steht. 308 vererbt das Ranking der alten Seite an die neue
         Entsprechung; das ist der einzige Weg, die aufgebaute Sichtbarkeit
         über den Systemwechsel zu retten.

         Zwei alte Seiten haben keinen Eins-zu-eins-Nachfolger:

         /galerie   → /geschichte. Die dreizehn Bilder der alten Bildstrecke
                      leben in der Erzählseite weiter, dort steht dieselbe
                      Marke in Bildern — nur mit Text darum herum.

         Chiaretto  → /unsere-weine. Der Riviera del Garda Classico ist nicht
                      mehr im Sortiment. Eine Weiterleitung auf einen ANDEREN
                      Wein wäre eine Falschauskunft an jeden, der genau diese
                      Flasche gesucht hat; die Kollektion ist die ehrliche
                      Entsprechung und zeigt, was es stattdessen gibt.

         Der Theme-Ballast der alten Installation (/portfolio/*, /sample-page,
         /projects-2) bekommt bewusst KEINE Regel: Diese Seiten hatten nie
         eigenen Inhalt und sollen als 404 aus dem Index fallen. */
      { source: "/home", destination: "/", permanent: true },
      { source: "/ueber-uns", destination: "/geschichte", permanent: true },
      { source: "/vision", destination: "/geschichte", permanent: true },
      { source: "/galerie", destination: "/geschichte", permanent: true },
      { source: "/news", destination: "/magazin", permanent: true },
      { source: "/primitivo-di-manduria", destination: "/regionen", permanent: true },
      { source: "/lugana-doc", destination: "/unsere-weine/lugana", permanent: true },
      { source: "/unsere-weine/lugana-doc", destination: "/unsere-weine/lugana", permanent: true },
      { source: "/unsere-weine/primitivo-145-2", destination: "/unsere-weine/primitivo-14-5", permanent: true },
      { source: "/unsere-weine/primitivo-145-2-old", destination: "/unsere-weine/primitivo-14-5", permanent: true },
      { source: "/unsere-weine/primitivo-155", destination: "/unsere-weine/primitivo-15-5", permanent: true },
      { source: "/unsere-weine/greco-di-tufo-d-o-c-g", destination: "/unsere-weine/greco-di-tufo", permanent: true },
      { source: "/unsere-weine/riviera-del-garda-classico-chiaretto-dop", destination: "/unsere-weine", permanent: true },
      { source: "/datenschutzerklaerung", destination: "/datenschutz", permanent: true },
    ];
  },
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
