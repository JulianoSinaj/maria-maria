/* Regional-Showcase — die Regeln, die Panel und Server teilen.
   ==================================================================
   Reine Struktur: Schlüssel, Grenzen, Vorgaben, Prüfung. Kein `fs`, kein
   Server-Import — der Konfigurator im Browser liest diese Datei direkt, der
   Store (./store.js) und die API benutzen dieselben Funktionen. Zwei
   Regelsätze wären zwei Regelsätze, die irgendwann auseinanderlaufen.

   Was das Layout steuert, steht in ./store.js beschrieben; der TEXT der
   Herkünfte liegt in content/<sprache>/ und wird im Seiten-Editor gepflegt. */

export const SHOWCASE_REGION_KEYS = ["apulien", "kampanien", "garda"];
export const MOBILE_VARIANTS = ["stack", "rail"];

export const GROW_MIN = 3;
export const GROW_MAX = 14;

/* Foto und Bildausschnitt je Herkunft — die Geometrie der Vorschau, nicht
   ihr Text. Dateinamen und Ausschnitte sind dieselben, die HomeContent an
   den Explorer reicht; wären sie es nicht, zeigte die Vorschau ein anderes
   Bild als die Seite. */
export const SHOWCASE_META = {
  apulien: { img: "/img/home/weinregion-apulien-trulli-olivenbaeume.webp", pos: "26% 50%" },
  kampanien: { img: "/img/home/weinregion-kampanien-vesuv-kueste.webp", pos: "40% 45%" },
  garda: { img: "/img/home/weinregion-gardasee-lombardei.webp", pos: "38% 55%" },
};

/* Die Vorgaben sind exakt das, was components/home/RegionExplorer.jsx
   vorher fest verdrahtet hatte: Hover öffnet, GROW 10.5, gestapelte Karten
   auf dem Telefon. Eine unangetastete Konfiguration heißt „die Seite von
   heute". */
export function defaultShowcaseConfig() {
  return {
    layout: {
      desktop: { hoverExpand: true, grow: 10.5 },
      mobile: { variant: "stack" },
    },
  };
}

/** Structural validation of a config patch. Empty array = valid. */
export function validateShowcasePatch(patch) {
  const errs = [];

  const d = patch.layout?.desktop;
  if (d) {
    if (d.hoverExpand !== undefined && typeof d.hoverExpand !== "boolean")
      errs.push("layout.desktop.hoverExpand must be a boolean");
    if (
      d.grow !== undefined &&
      !(typeof d.grow === "number" && d.grow >= GROW_MIN && d.grow <= GROW_MAX)
    )
      errs.push(`layout.desktop.grow must be between ${GROW_MIN} and ${GROW_MAX}`);
  }
  const m = patch.layout?.mobile;
  if (m?.variant !== undefined && !MOBILE_VARIANTS.includes(m.variant))
    errs.push(`layout.mobile.variant must be one of ${MOBILE_VARIANTS.join(", ")}`);

  /* Der Text zog in den Seiten-Editor um. Ein Patch, der ihn noch mitschickt
     (alter Tab, altes Skript), wird nicht still geschluckt: sonst hielte der
     Absender seine Änderung für gespeichert, während die Seite unverändert
     bliebe. */
  if (patch.regions !== undefined)
    errs.push("regional copy moved to the pages editor — PUT /api/admin/pages instead");

  return errs;
}
