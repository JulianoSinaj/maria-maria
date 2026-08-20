/* AUTOGENERIERT von scripts/optimize-kontakt.mjs — nicht von Hand bearbeiten.

   Winzige (20 px breite) WebP-Vorschauen der drei Kontaktseiten-Motive als
   Data-URI. Sie stehen im server-gerenderten Markup und füllen die Fläche
   sofort, während das volle Foto noch lädt — kein cremefarbener Blitz im
   Hero (LCP) und kein leerer Rahmen beim Scrollen in Bridge und FAQ. */

export const KONTAKT_BLUR = {
  "hero": "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAABQBACdASoUAAsAPxl2slCspySisAgBkCMJYwCdMoACiEPEupxD/1M14YAAAP6Udn8xH8G/0B3IK3OhgoTw6o4IplgJPr2pJab3dN9k3+PIr/4Uwvw0i+wAAAA=",
  "bridge": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAACwAwCdASoUAAgAPxl2s1EspySisAgBkCMJQBOmUABQlKSvyRX8AAD+0DBjEFn8+3vCrCbBiD0L59kCUl20OH3cwYD+hjzdwLIsOFAA",
  "faq": "data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAACQAwCdASoUAA8APxl0slCspqSisAgBkCMJZQC7ABIT/dYeO0QgANcletvg/xVJn7b/pRzO1dY5kwrjDwQvBYh8LdaZpnIdT+6h5MDlQW1bqdSF3//IHDinoS6BW+AI7xe7EAAA"
};

export const kontaktBlurFor = (key) => KONTAKT_BLUR[key] ?? null;
