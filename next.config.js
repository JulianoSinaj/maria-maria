/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;
