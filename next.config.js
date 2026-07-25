/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        /* Die Wein-Fotos sind content-stabil: ändert sich ein Motiv, wird die
           Datei ohnehin über scripts/optimize-heroes.mjs neu erzeugt und
           deployed. Ein Jahr immutable spart bei jedem Zweitaufruf die
           komplette Revalidierungs-Runde — der Hero steht dann sofort. */
        source: "/img/wines/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
