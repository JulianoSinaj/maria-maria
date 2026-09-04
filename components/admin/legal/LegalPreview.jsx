"use client";
import { useAdminI18n } from "../i18n/AdminI18n";

/* Vorschau einer Rechtsseite — so, wie sie draußen steht.

   Bewusst in der ROHEN Storefront-Palette (cream / charcoal / champagne /
   bordeaux) statt in den a-*-Tokens des Backoffice: Eine Vorschau soll die
   Seite zeigen, nicht das Werkzeug. Im dunklen Adminschema bleibt sie
   deshalb hell — dieselbe Regel wie beim Hero-Mock und den Karten-Stages
   (siehe app/(admin)/admin.css).

   Sie ahmt components/legal/LegalShell.jsx nach: Kicker, Titel, Traubenlinie,
   Datumszeile, Verbindlichkeitskasten, Lede, Abschnitte. Nicht dieselbe
   Komponente, weil LegalShell die Atmosphäre der Seite mitbringt (Atmosphere,
   LocaleLink, volle Seitenhöhe) und hier in eine Karte muss. Was zählt, ist
   die Reihenfolge und das Textmaß — und die stimmen. */

export default function LegalPreview({ shell, title, intro, sections, updated, reviewed }) {
  const { t } = useAdminI18n();
  const stand = updated ?? shell?.updated;

  return (
    <div className="overflow-hidden rounded-2xl border border-a-ink/[0.08] bg-cream">
      {/* Browserleiste — macht ohne Worte klar, dass hier die Website steht */}
      <div className="flex items-center gap-1.5 border-b border-charcoal/[0.08] bg-ivory px-4 py-2.5">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-charcoal/15" />
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-charcoal/15" />
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-charcoal/15" />
        <span className="ml-2 truncate text-[10px] tracking-[0.06em] text-charcoal/40">
          {t("legal.previewNote")}
        </span>
      </div>

      <div className="max-h-[560px] overflow-y-auto overscroll-contain px-6 py-7" data-lenis-prevent>
        {shell?.eyebrow && (
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.24em] text-bordeaux/60">
            {shell.eyebrow}
          </p>
        )}

        <h3 className="mt-3 font-playfair text-[24px] leading-[1.1] text-charcoal">
          {title || "—"}
        </h3>

        <span aria-hidden="true" className="mt-4 block h-px w-14 bg-champagne" />

        {(stand || reviewed) && (
          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[9.5px] uppercase tracking-[0.16em] text-charcoal/50">
            {stand && (
              <p>
                {shell?.updatedLabel} {stand}
              </p>
            )}
            {reviewed && shell?.reviewedLabel && (
              <p className="flex items-baseline gap-1.5">
                <span
                  aria-hidden="true"
                  className="h-1 w-1 shrink-0 translate-y-[-2px] rounded-full bg-champagne"
                />
                {shell.reviewedLabel} {reviewed}
              </p>
            )}
          </div>
        )}

        {shell?.bindingNotice && (
          <p className="mt-4 rounded-xl border border-champagne/40 bg-champagne/10 px-4 py-3 text-[10.5px] leading-relaxed text-charcoal/75">
            {shell.bindingNotice}
          </p>
        )}

        {intro && (
          <p className="mt-4 text-[11.5px] leading-relaxed text-charcoal/75">{intro}</p>
        )}

        <div className="mt-8 space-y-7">
          {sections.map((s, i) => (
            <section key={i}>
              <h4 className="font-playfair text-[15px] leading-snug text-charcoal">
                {s.title || "—"}
              </h4>
              <span aria-hidden="true" className="mt-2 block h-px w-8 bg-champagne/80" />
              <div className="mt-3 space-y-2 text-[11px] leading-relaxed text-charcoal/75">
                {s.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-stone/50 bg-white/60 p-4">
          <p className="text-[10.5px] leading-relaxed text-charcoal/70">
            {shell?.contactPre}{" "}
            <span className="font-medium text-bordeaux underline decoration-bordeaux/30 underline-offset-2">
              {shell?.contactLink}
            </span>{" "}
            {shell?.contactMid}{" "}
            <span className="font-medium text-bordeaux underline decoration-bordeaux/30 underline-offset-2">
              info@maria-maria.de
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
