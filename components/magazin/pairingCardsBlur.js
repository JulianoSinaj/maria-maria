/* AUTOGENERIERT von scripts/optimize-pairing-cards.mjs — nicht von Hand bearbeiten.

   Winzige (20 px breite) WebP-Vorschauen der Magazine-Card-Fotos als Data-URI.
   Sie stehen im server-gerenderten Markup und füllen die Karte sofort,
   während das volle Foto noch lädt — kein weißer Blitz beim Scrollen ins
   Kapitel.

   Getrennt von pairingBlur.js, weil die Quellen verschieden sind: dort
   public/img/food-pairing (Landingpage-Motive), hier der Unterordner cards. */

export const CARD_BLUR = {
  "aperitivo": "data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAAAwBACdASoUAA8APxl0sVCspqSisAgBkCMJbACdMoRwACnAH3NntRYf5uAA/pGmnWTrrYELjpEUKVZcEI2EGeV8dO6u42OpkCJKI8IU8NKCaNWIVYh+NgimwOsQwc7K/jH6c+knfgTUaCMvG2gNkEXqLVH1KlQvgAA=",
  "pasta-abend": "data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAADwAwCdASoUAA8APxl0sVCspqSisAgBkCMJZACdABuKGMQOxuSzf9TgAP7ceWhRMC4dSrZnl9YRR5tY9j9k7mPIIpEVp1shKfEdwzyKfpWcaUWkQhP1dxV9IsJ3QZrWApKgfXs/skMeVO/snmMpJ8js8HV6cguy10T43VwCyAA=",
  "fisch-meer": "data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAADQAwCdASoUAA8APxl0slEspqSisAgBkCMJQBgbgzpjbHz1RxJVOoAA/sX8jejEs3d6qcSKhqGcpxyPatqewdGkzcQpl69OAu7p8UwzxtlSb26E5wZAPyY5PNybnc+3tjGSgXaAVQfbOdOcxF+Cr3zWgf3tWjrkCNtkeHqBkBqAAA==",
  "grillabend": "data:image/webp;base64,UklGRoYAAABXRUJQVlA4IHoAAABQBACdASoUAA8APxl0slCspqSisAgBkCMJZgCdMoR3Ff/gLK6J44I83DyAAP6ooPBO4tWUIr4gZ2MRiz00yapmeotJ7TG3+0lGHKil2JR6Qlng12nNLQ/m5GlB1g2yW1rczM3UmLtG9E0MDKa7y/ZmEcHcXoNXCMYAAA==",
  "dinner": "data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAADQAwCdASoUAA8APxl0slEspqSisAgBkCMJZACw7BnlBId5UUtrScAA/tvJ6J69P9d5E1pUIux3CMnEAXn458TetsoGLFGYINd+T9Y+x7gafQsO7iRPq3ZsJkJ5+Aasxzre3CCofxdj+oc0crUielEAAAA="
};

export const cardBlurFor = (key) => CARD_BLUR[key] ?? null;
