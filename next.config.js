/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Verification builds set MM_DIST_DIR to an isolated directory so they
     never contend with dev servers writing .next — this machine tends to run
     several (IDE-supervised + sessions). Unset, everything behaves as stock. */
  ...(process.env.MM_DIST_DIR ? { distDir: process.env.MM_DIST_DIR } : {}),
  async headers() {
    /* Die Dateinamen unter /img und /video sind NICHT content-gehasht
       (hero-1280.webp bleibt hero-1280.webp, auch wenn das Motiv wechselt).
       Ein `immutable`-Jahr würde wiederkehrende Besucher bis zu einem Jahr
       auf dem alten Bild festnageln — daher ein Tag Frische plus eine Woche
       stale-while-revalidate: Zweitaufrufe bleiben sofort da, Änderungen
       kommen trotzdem zeitnah an. */
    const media = { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" };
    return [
      { source: "/img/:path*", headers: [media] },
      { source: "/video/:path*", headers: [media] },
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
