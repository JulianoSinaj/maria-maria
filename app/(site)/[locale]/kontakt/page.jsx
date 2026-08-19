import Photo from "@/components/media/Photo";
import { Reveal } from "@/components/motion/Reveal";
import { Clock, Mail, Pin } from "@/components/Icons";
import IntentProvider from "@/components/kontakt/IntentContext";
import HeroActions from "@/components/kontakt/HeroActions";
import IntentCards from "@/components/kontakt/IntentCards";
import ContactForm from "@/components/kontakt/ContactForm";
import KontaktFaq from "@/components/kontakt/KontaktFaq";
import { Calendar, Heart, Storefront } from "@/components/kontakt/icons";
import { FORM_ANCHOR } from "@/components/kontakt/intents";
import { HERO_INSET, SECTION_TITLE, SHELL, SHELL_WIDE } from "@/components/kontakt/styles";
import JsonLd from "@/components/seo/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localePath } from "@/lib/i18n/routing";
import { absoluteUrl } from "@/lib/site";
import { graph, webPageNode, breadcrumbNode, faqNode, ORG_ID } from "@/lib/seo/jsonLd";

/* Kontaktseite — Neubau nach dem freigegebenen Mockup
   („landing page contatti.png") und dem Handoff-Dokument vom 18.08.2026.

   Die Reihenfolge der Sektionen ist der Kern der Seite und nicht verhandelbar
   (Handoff §1): Hero → vier Anlässe → drei Schritte → Brand Bridge → Formular
   → FAQ. Das Formular kommt bewusst zuletzt: „Il form arriva solo dopo che
   l'utente ha capito perché contattare Maria Maria e quale valore riceve."

   Alles, was auf einen Klick reagiert — die vier Karten, die Hero-CTAs, das
   Formular, das Akkordeon —, liegt in Client-Komponenten unter
   components/kontakt/. Diese Datei bleibt eine Server-Komponente und liefert
   Text und Bilder; <IntentProvider> umschließt sie als Client-Komponente mit
   `children`, was den Baum darunter serverseitig lässt. */

export async function generateMetadata({ params }) {
  const dict = await getDictionary(params.locale);
  return pageMetadata({
    locale: params.locale,
    path: "/kontakt",
    meta: dict.meta.kontakt,
  });
}

function KontaktJsonLd({ locale, dict }) {
  const url = absoluteUrl(localePath(locale, "/kontakt"));
  const nav = dict?.common?.nav ?? {};
  const localize = (href) => localePath(locale, href);

  const crumbs = breadcrumbNode(
    [
      { label: nav.home || "Home", href: "/" },
      { label: nav.contact || "Kontakt", href: "/kontakt" },
    ],
    { url, localize }
  );

  return (
    <JsonLd
      data={graph(
        {
          ...webPageNode({
            url,
            name: dict.meta.kontakt.title,
            description: dict.meta.kontakt.description,
            locale,
            type: "ContactPage",
            breadcrumbId: crumbs?.["@id"] ?? null,
          }),
          mainEntity: { "@id": ORG_ID },
        },
        crumbs,
        faqNode({ url, items: dict.kontakt.faq.items ?? [] })
      )}
    />
  );
}

const HERO_IMG = "/img/kontakt/kontakt-hero-375ml.webp";
const BRIDGE_IMG = "/img/kontakt/kontakt-momente.webp";
const FAQ_IMG = "/img/kontakt/kontakt-weinberatung.webp";

const HINT_ICONS = [Calendar, Storefront];

export default async function KontaktPage({ params }) {
  const dict = await getDictionary(params.locale);
  const t = dict.kontakt;

  return (
    <>
      {/* Außerhalb von <IntentProvider>: Der JSON-LD-Block gehört ins HTML,
          nicht in die Hydration. Innerhalb einer Client-Komponente wird das
          <script> Teil des hydrierten Baums, und React meldete prompt
          „Expected server HTML to contain a matching <script> in <div>". */}
      <KontaktJsonLd locale={params.locale} dict={dict} />

      <IntentProvider>
      <div className="bg-linen">
        {/* ═══════ 01 — HERO ═══════════════════════════════════════════
            50/52 wie im Mockup: Text links auf der äußeren Kante, Foto
            rechts randlos bis zum Bildschirmrand. */}
        <section className="relative overflow-hidden pt-24 lg:pt-28">
          <div className="grid grid-cols-1 items-stretch lg:grid-cols-[minmax(0,48fr)_minmax(0,52fr)]">
            {/* lg:pb-14 statt pb-20: Die Fusszeile der Textspalte bestimmt die
                Hoehe der ganzen Zeile und damit die des randlosen Fotos
                daneben (items-stretch). Mit 80 px stand das Foto auf 585 px,
                die Referenz „landing page contatti.png" zeigt es bei 1440 px
                Fensterbreite auf 562 px. 24 px weniger treffen das Mockup. */}
            <div style={HERO_INSET} className="pb-14 pr-6 lg:pb-14 lg:pr-10">
              <div className="lg:max-w-[560px]">
                <Reveal y={16}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                    {t.hero.eyebrow}
                  </p>
                  <h1 className="mt-5 font-playfair text-[clamp(2rem,3.6vw,2.9rem)] font-normal leading-[1.13] text-charcoal">
                    {t.hero.title}
                    <span className="block">{t.hero.titleSecond}</span>
                  </h1>
                  <p className="mt-5 max-w-[29rem] text-[14px] leading-[1.75] text-charcoal/75">
                    {t.hero.text}
                  </p>
                </Reveal>

                <Reveal y={14} delay={0.12}>
                  <HeroActions primary={t.hero.ctaPrimary} secondary={t.hero.ctaSecondary} />
                </Reveal>

                {/* Kontaktzeilen. Die Telefonnummer aus dem Mockup ist laut
                    Handoff falsch und darf nicht erscheinen — bis die
                    richtige bestätigt ist, stehen hier zwei Angaben statt
                    drei, nicht ein Platzhalter. */}
                <Reveal y={12} delay={0.2}>
                  <dl className="mt-11 flex flex-wrap gap-x-14 gap-y-6">
                    <div>
                      <dt className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
                        <Mail aria-hidden="true" className="h-4 w-4 text-terracotta" />
                        {t.details.emailLabel}
                      </dt>
                      <dd className="mt-1.5">
                        <a
                          href={`mailto:${t.details.email}`}
                          className="text-[13.5px] text-charcoal transition-colors duration-300 hover:text-terracotta"
                        >
                          {t.details.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
                        <Pin aria-hidden="true" className="h-4 w-4 text-terracotta" />
                        {t.details.locationLabel}
                      </dt>
                      <dd className="mt-1.5 text-[13.5px] text-charcoal">{t.details.location}</dd>
                    </div>
                  </dl>

                  <hr className="mt-8 border-t border-sand" />

                  <p className="mt-5 flex items-center gap-2.5 text-[12.5px] text-charcoal/70">
                    <Clock aria-hidden="true" className="h-4 w-4 shrink-0 text-terracotta" />
                    {t.hero.promise}
                  </p>
                </Reveal>
              </div>
            </div>

            {/* Das LCP-Bild: eager, hohe Priorität, kein Lazy-Load
                (Handoff §17). */}
            <div className="relative min-h-[300px] sm:min-h-[380px] lg:min-h-[560px]">
              <Photo
                src={HERO_IMG}
                alt={t.hero.imageAlt}
                sizes="(min-width: 1024px) 52vw, 100vw"
                loading="eager"
                fetchPriority="high"
                width={1672}
                height={941}
                /* Das Motiv ist 16:9, die Spalte ist deutlich hochkantiger —
                   ein zentrierter Zuschnitt schneidet die rechte Flasche an.
                   64 % waren dafür zu weit rechts: Bei 741 x 675 lag das
                   Fenster auf Quell-x 408–1441, und „il bianco" endet erst bei
                   1445 — die Flasche stand senkrecht angeschnitten am Rand.
                   57 % zeigt bei der korrigierten Höhe x 244–1487: beide
                   Flaschen mit Luft, die Gläser und die Karte auf dem Tisch
                   ganz im Bild, das Windlicht (ab x 1490) sauber draußen. */
                className="absolute inset-0 h-full w-full object-cover object-[57%_center]"
              />
            </div>
          </div>
        </section>

        {/* ═══════ 02 — WARUM MÖCHTEN SIE UNS KONTAKTIEREN? ═══════════ */}
        <section aria-labelledby="anliegen" className="py-20 lg:py-24">
          <div className={SHELL}>
            <Reveal>
              <h2 id="anliegen" className={SECTION_TITLE}>
                {t.intents.title}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-center text-[13.5px] leading-relaxed text-charcoal/70">
                {t.intents.intro}
              </p>
            </Reveal>

            <IntentCards copy={t.intents} />
          </div>
        </section>

        {/* ═══════ 03 — SO EINFACH FINDEN WIR IHREN WEIN ═════════════ */}
        <section aria-labelledby="ablauf" className="pb-20 lg:pb-24">
          <div className={SHELL}>
            <Reveal>
              <h2 id="ablauf" className={SECTION_TITLE}>
                {t.process.title}
              </h2>
            </Reveal>

            <Reveal y={18} delay={0.08}>
              <ol className="mt-11 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-7">
                {t.process.steps.map((step, i) => (
                  <li key={step.title} className="relative flex items-start gap-4">
                    {/* Verbindungslinie zwischen den Schritten — rein
                        dekorativ, deshalb aria-hidden. Breite und Versatz
                        entsprechen exakt `gap-7` (28 px): eine prozentuale
                        Angabe würde je nach Spaltenbreite in den Text der
                        vorigen Spalte hineinragen. */}
                    {i > 0 && (
                      <span
                        aria-hidden="true"
                        className="absolute -left-7 top-[21px] hidden w-7 border-t border-dotted border-terracotta/45 md:block"
                      />
                    )}
                    <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-terracotta font-playfair text-[17px] text-linen">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-playfair text-[17px] font-semibold leading-snug text-charcoal">
                        {step.title}
                      </h3>
                      <p className="mt-2.5 text-[12.5px] leading-[1.7] text-charcoal/70">
                        {step.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal y={12} delay={0.16}>
              <p className="mt-12 text-center text-[13.5px] text-charcoal/75">
                {t.process.closing}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ═══════ 04 — EMOTIONAL BRAND BRIDGE ══════════════════════
            Randloses Foto, dunkler Verlauf von links: Der Text darf über
            der Tischplatte stehen, nicht über den Flaschen. */}
        <section className="relative isolate overflow-hidden">
          <Photo
            src={BRIDGE_IMG}
            alt={t.bridge.imageAlt}
            sizes="100vw"
            width={1942}
            height={809}
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-espresso/85 via-espresso/55 to-espresso/10"
          />

          <div className={`${SHELL_WIDE} py-24 lg:py-28`}>
            <Reveal y={20}>
              <div className="max-w-[34rem]">
                <h2 className="text-balance font-playfair text-[clamp(1.6rem,3.2vw,2.2rem)] leading-[1.22] text-ivory">
                  {t.bridge.title}
                </h2>
                <p className="mt-5 max-w-[30rem] text-[13.5px] leading-[1.8] text-ivory/80">
                  {t.bridge.text}
                </p>
                <p className="mt-6 font-playfair text-[16px] italic text-champagne-light">
                  {t.bridge.claim}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══════ 05 — LEAD-FORMULAR ═══════════════════════════════
            Split 36/100: links der Kontext, rechts die weiße Karte. Der
            Anker #anfrage sitzt auf der Sektion, damit nach dem Klick auf
            eine Karte die Erklärung mit im Bild steht, nicht nur die
            Felder. */}
        <section
          id={FORM_ANCHOR}
          aria-labelledby="anfrage-titel"
          className="scroll-mt-24 py-20 lg:py-24"
        >
          <div className={SHELL_WIDE}>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,1fr)] lg:gap-14">
              <Reveal y={18}>
                <div className="lg:pr-4 lg:pt-2">
                  <h2
                    id="anfrage-titel"
                    className="text-balance font-playfair text-[clamp(1.5rem,3vw,2rem)] leading-[1.2] text-charcoal"
                  >
                    {t.form.title}
                  </h2>
                  <p className="mt-4 text-[13px] leading-[1.7] text-charcoal/70">
                    {t.form.intro}
                  </p>

                  <ul className="mt-7 space-y-3">
                    {t.form.hints.map((hint, i) => {
                      const Icon = HINT_ICONS[i] ?? Calendar;
                      return (
                        <li
                          key={hint.title}
                          className="flex items-start gap-3.5 rounded-[6px] bg-terracotta-soft px-4 py-3.5"
                        >
                          <Icon
                            aria-hidden="true"
                            className="mt-0.5 h-[22px] w-[22px] shrink-0 text-terracotta"
                          />
                          <p className="text-[12.5px] leading-[1.6] text-charcoal/80">
                            <span className="font-semibold text-charcoal">{hint.title}:</span>{" "}
                            {hint.text}
                          </p>
                        </li>
                      );
                    })}
                  </ul>

                  <p className="mt-8 flex items-start gap-3.5 text-[12.5px] leading-[1.6] text-charcoal/75">
                    <Heart aria-hidden="true" className="h-[22px] w-[22px] shrink-0 text-terracotta" />
                    {t.form.trust}
                  </p>
                </div>
              </Reveal>

              <Reveal y={22} delay={0.08}>
                <ContactForm copy={t.form} />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══════ 06 — HÄUFIGE FRAGEN ══════════════════════════════ */}
        <section aria-labelledby="fragen" className="pb-24 lg:pb-28">
          <div className={SHELL_WIDE}>
            <Reveal>
              <h2 id="fragen" className={SECTION_TITLE}>
                {t.faq.title}
              </h2>
            </Reveal>

            <div className="mt-9 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,0.8fr)] lg:gap-14">
              <Reveal y={18}>
                <KontaktFaq copy={t.faq} />
              </Reveal>

              <Reveal y={18} delay={0.08}>
                <Photo
                  src={FAQ_IMG}
                  alt={t.faq.imageAlt}
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  width={1448}
                  height={1086}
                  className="h-full max-h-[360px] w-full rounded-[10px] object-cover"
                />
              </Reveal>
            </div>
          </div>
        </section>
      </div>
      </IntentProvider>
    </>
  );
}
