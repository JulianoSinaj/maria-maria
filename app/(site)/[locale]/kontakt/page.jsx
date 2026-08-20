import Photo from "@/components/media/Photo";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/Deco";
import { Clock, Mail, Pin } from "@/components/Icons";
import IntentProvider from "@/components/kontakt/IntentContext";
import HeroActions from "@/components/kontakt/HeroActions";
import IntentCards from "@/components/kontakt/IntentCards";
import ContactForm from "@/components/kontakt/ContactForm";
import EmailLink from "@/components/kontakt/EmailLink";
import KontaktFaq from "@/components/kontakt/KontaktFaq";
import { Calendar, Heart, Storefront } from "@/components/kontakt/icons";
import { FORM_ANCHOR, INTENT_CARDS } from "@/components/kontakt/intents";
import { HERO_INSET, SECTION_TITLE, SHELL, SHELL_WIDE } from "@/components/kontakt/styles";
import JsonLd from "@/components/seo/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localePath } from "@/lib/i18n/routing";
import { absoluteUrl } from "@/lib/site";
import { graph, webPageNode, breadcrumbNode, faqNode, serviceNode, ORG_ID } from "@/lib/seo/jsonLd";

/* Kontaktseite — Struktur und Texte nach dem Handoff-Dokument vom
   18.08.2026, visuelle Sprache seit dem 20.08.2026 die der Storefront:
   Bordeaux/Champagner statt des Terrakotta-Dialekts aus dem Mockup, die
   Pillen aus components/ui/Button, Stone-Haarlinien und die Kartenradien
   der übrigen Seiten. Der Ton liegt gesammelt in components/kontakt/styles.js.

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
    /* Eigenes Teaserbild statt des Marken-Standardmotivs: Diese Seite wird
       per Link weitergereicht — an Restaurantleitungen, Einkauf, Agenturen.
       Was in WhatsApp oder LinkedIn aufklappt, soll dasselbe Motiv sein, das
       nach dem Klick oben auf der Seite steht. Die Bildbeschreibung ist
       dieselbe wie am Hero-Foto; ein zweiter, gepflegter Alt-Text daneben
       wäre eine Stelle mehr, an der die beiden auseinanderlaufen. */
    image: { ...KONTAKT_OG_IMAGE, alt: dict.kontakt.hero.imageAlt },
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

  /* Die vier Anliegen der Kachel als Dienstleistungen — dieselben Titel und
     Texte, die auf der Seite stehen, mit dem Formular als Anfrageweg. Der
     technische Wert (gastronomie_feinkost …) trägt die @id, damit sie eine
     Umformulierung der Kachel überlebt. */
  const services = INTENT_CARDS.map(({ key, value }) => {
    const item = dict.kontakt.intents?.items?.[key];
    if (!item) return null;

    return serviceNode({
      url,
      slug: value,
      name: item.title,
      description: item.text,
      channelUrl: `${url}#${FORM_ANCHOR}`,
      channelName: item.cta,
    });
  });

  return (
    <JsonLd
      data={graph(
        {
          ...webPageNode({
            url,
            /* `titleAbsolute`, weil das SEO-Paket des Handoffs die Marke im
               Titel selbst führt — meta.kontakt.title gibt es hier nicht
               mehr. */
            name: dict.meta.kontakt.titleAbsolute ?? dict.meta.kontakt.title,
            description: dict.meta.kontakt.description,
            locale,
            type: "ContactPage",
            image: { url: HERO_IMG, alt: dict.kontakt.hero.imageAlt },
            breadcrumbId: crumbs?.["@id"] ?? null,
          }),
          mainEntity: { "@id": ORG_ID },
        },
        crumbs,
        services,
        faqNode({ url, items: dict.kontakt.faq.items ?? [] })
      )}
    />
  );
}

const HERO_IMG = "/img/kontakt/kontakt-hero-375ml.webp";
/* 1200 × 630, erzeugt von scripts/og-images.mjs aus HERO_IMG (`npm run og`). */
const KONTAKT_OG_IMAGE = { url: "/img/og/kontakt.jpg", width: 1200, height: 630 };
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
      {/* Kein eigener Seitengrund mehr: Die Seite liegt wie alle anderen auf
          dem Ivory des <body> (globals.css) statt auf einem eigenen Linen. */}
      <div className="-mb-12 lg:-mb-16">
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
                  {/* Der Sektions-Öffner der Storefront: Champagner-Versalien
                      mit Traubenmarke (components/Deco.jsx) statt der
                      Terrakotta-Zeile des Mockups. */}
                  <Eyebrow>{t.hero.eyebrow}</Eyebrow>
                  <h1 className="mt-5 text-balance font-playfair text-[clamp(2.1rem,4vw,3.1rem)] font-normal leading-[1.1] text-charcoal">
                    {t.hero.title}
                    <span className="block">{t.hero.titleSecond}</span>
                  </h1>
                  <p className="mt-5 max-w-[29rem] text-[13.5px] leading-relaxed text-charcoal/70">
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
                        <Mail aria-hidden="true" className="h-4 w-4 text-bordeaux" />
                        {t.details.emailLabel}
                      </dt>
                      <dd className="mt-1.5">
                        {/* Client-Inselchen für das click_email-Event —
                            Handoff §16, direkter Kontakt am Formular vorbei. */}
                        <EmailLink
                          email={t.details.email}
                          location="hero"
                          className="text-[13.5px] text-charcoal transition-colors duration-300 hover:text-bordeaux"
                        />
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
                        <Pin aria-hidden="true" className="h-4 w-4 text-bordeaux" />
                        {t.details.locationLabel}
                      </dt>
                      <dd className="mt-1.5 text-[13.5px] text-charcoal">{t.details.location}</dd>
                    </div>
                  </dl>

                  <hr className="mt-8 border-t border-stone/60" />

                  <p className="mt-5 flex items-center gap-2.5 text-[12.5px] text-charcoal/70">
                    <Clock aria-hidden="true" className="h-4 w-4 shrink-0 text-bordeaux" />
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
                   der Zuschnitt entscheidet hier allein über links und rechts.
                   Der Rahmen bleibt, wo er ist; nur das Fenster wandert.

                   90 % schiebt es fast an die rechte Kante der Quelle und
                   trifft damit den Ausschnitt der zweiten, freigegebenen
                   Fassung des Fotos (1102 × 941 — 570 px links abgeschnitten,
                   rechts bündig): Die Gläser stehen um die Bildmitte statt am
                   rechten Rand, beide Flaschen behalten Luft, das Windlicht
                   kommt rechts mit herein. Bei 1440 px liegt das Fenster auf
                   Quell-x 386–1629, bei 1280 px auf 557–1610.

                   Nicht 100 %: Bei 1024 px trägt die italienische Textspalte
                   die höchste Zeile (Foto 525 × 619), das Fenster ist dort nur
                   798 Quell-Pixel breit und begänne bei x 874 — das linke Glas
                   (ab x 866) stünde angeschnitten an der Kante. 90 % setzt
                   dort bei 787 an und lässt ihm gut 50 px Luft.

                   Die 57 % davor saßen zu weit links: Die Gläser lagen bei
                   61 % der Bildbreite, und unter ~1200 px Fensterbreite
                   schnitt der rechte Rand „il bianco" an. */
                className="absolute inset-0 h-full w-full object-cover object-[90%_center]"
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
                        className="absolute -left-7 top-[21px] hidden w-7 border-t border-dotted border-champagne md:block"
                      />
                    )}
                    {/* Der Verlauf des Primär-Buttons (bordeaux → wine) als
                        Ziffernmedaillon — dieselbe Fläche, die auf allen
                        Seiten „hier geht es weiter" bedeutet. */}
                    <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-bordeaux to-wine font-playfair text-[17px] text-ivory">
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
                          className="flex items-start gap-3.5 rounded-2xl bg-champagne-light/25 px-4 py-3.5"
                        >
                          <Icon
                            aria-hidden="true"
                            className="mt-0.5 h-[22px] w-[22px] shrink-0 text-bordeaux"
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
                    <Heart aria-hidden="true" className="h-[22px] w-[22px] shrink-0 text-bordeaux" />
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
        <section aria-labelledby="fragen" className="pb-14 lg:pb-16">
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
                  className="h-full max-h-[360px] w-full rounded-card-lg object-cover"
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
