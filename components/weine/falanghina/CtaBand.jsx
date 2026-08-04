import ShopCtaBand from "@/components/ui/ShopCtaBand";
import { ACCENT_FALLBACK } from "./accent";

/* Abschlussband der Weinseiten — dünner Wrapper um die geteilte Bauform
   (components/ui/ShopCtaBand), damit alle Shop-CTAs der Site identisch
   aussehen. Einziger Unterschied: die Shader-Bühne atmet im Ton des Etiketts
   (wine.accent, wie FAQ und ColorBand), statt auf allen neun Seiten dasselbe
   Bordeaux zu zeigen. Der Weinname steht als kursiver Akzent im Titel und
   übernimmt damit die Rolle, die sonst ein Packshot hätte. */

const mixHex = (a, b, t) => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (sh) => Math.round(((pa >> sh) & 255) * (1 - t) + ((pb >> sh) & 255) * t);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0")}`;
};

export default function CtaBand({ wine }) {
  const accent = wine.accent ?? wine.moment?.accent ?? ACCENT_FALLBACK;

  /* vier Stufen hell → dunkel, wie die benannten Shader-Paletten */
  const colors = [
    mixHex(accent.deep, "#0E0B0A", 0.2),
    mixHex(accent.deep, "#0E0B0A", 0.5),
    mixHex(accent.deep, "#0E0B0A", 0.72),
    mixHex(accent.deep, "#0E0B0A", 0.9),
  ];

  return (
    <ShopCtaBand
      colors={colors}
      eyebrow="Der offizielle Shop"
      title={
        <>
          {wine.cta.title} <span className="italic text-champagne">{wine.name}</span>
        </>
      }
      text={wine.cta.text}
      primary={{ label: wine.cta.button.label, href: wine.cta.button.href }}
      secondary={{ label: "Alle Weine", href: "/weine" }}
      /* damit GA4 den Shop-Klick der auslösenden Landingpage zuordnen kann */
      wine={wine.slug}
    />
  );
}
