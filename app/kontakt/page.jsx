import ShaderGradient from "@/components/motion/ShaderGradient";
import SplitText from "@/components/motion/SplitText";
import TiltCard from "@/components/motion/TiltCard";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { SectionTitle, Eyebrow, GrapeRule, IconChip } from "@/components/Deco";
import ContactForm from "@/components/kontakt/ContactForm";
import FaqSection from "@/components/faq/FaqSection";
import { KONTAKT_FAQ_GROUPS } from "@/components/faq/faqData";
import NewsletterSignup from "@/components/kontakt/NewsletterSignup";
import { Mail, Phone, Pin, Instagram, Facebook, LinkedIn, Arrow, Clock } from "@/components/Icons";
import Atmosphere, { Aura, GhostWord, Vines } from "@/components/Atmosphere";

export const metadata = {
  title: "Kontakt — Maria Maria",
  description:
    "Wir freuen uns auf Ihre Nachricht – Weinverkostungen in Düsseldorf, Fragen zu unseren Weinen, Partnerschaften oder Händleranfragen.",
};

/* lokale Feature-Icons (48er-Viewbox, gleicher Strichstil wie Icons.jsx) */
const F = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" };

const TastingIcon = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M14 10c-2 6-2 9 2 11 0 4-2 12-4 14M28 10c2 6 2 9-2 11 0 4 2 12 4 14" />
    <path d="M9 35h10M27 35h10" />
    <path d="M17 21h6" />
  </svg>
);
const MerchantIcon = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M9 19l2-9h26l2 9z" />
    <path d="M11 19v19h26V19" />
    <path d="M20 38v-9h8v9" />
    <path d="M9 19h30" />
  </svg>
);
const PressIcon = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M6 18l7-2 5 4M42 18l-7-2-5 4" />
    <path d="M18 20c2 2.5 4 4 6 4s4-1.5 6-4" />
    <path d="M6 18v9l6 2M42 18v9l-6 2" />
  </svg>
);
const QuestionIcon = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M6 11h20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H14l-6 4v-4H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" />
    <path d="M32 18h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2v3l-4-3h-4" />
  </svg>
);

const HELP = [
  {
    title: "Verkostungen",
    text: "Sie möchten unsere Weine verkosten? Hier erfahren Sie, wie es geht.",
    icon: <TastingIcon className="h-7 w-7" />,
  },
  {
    title: "Händleranfragen",
    text: "Sie sind Händler oder möchten unsere Weine in Ihr Sortiment aufnehmen?",
    icon: <MerchantIcon className="h-7 w-7" />,
  },
  {
    title: "Presse & Kooperationen",
    text: "Für Presseanfragen, Kooperationen oder gemeinsame Projekte sind wir offen.",
    icon: <PressIcon className="h-7 w-7" />,
  },
  {
    title: "Allgemeine Fragen",
    text: "Sie haben eine allgemeine Frage zu Maria Maria? Wir helfen Ihnen gerne weiter.",
    icon: <QuestionIcon className="h-7 w-7" />,
  },
];

const CONTACT = [
  { label: "E-Mail", value: "info@maria-maria.wine", href: "mailto:info@maria-maria.wine", Icon: Mail },
  { label: "Telefon", value: "+49 211 976 420", href: "tel:+49211976420", Icon: Phone },
  { label: "Adresse", value: "Maria Maria Wines · Düsseldorf, Deutschland", Icon: Pin },
];

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/mariamaria.wine", Icon: Instagram },
  { label: "Facebook", href: "https://www.facebook.com/mariamaria.wine", Icon: Facebook },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/mariamaria-wine", Icon: LinkedIn },
];

export default function KontaktPage() {
  return (
    <div className="relative min-h-screen">
      {/* ============ HERO — Intro + Formular ============ */}
      <section className="grain relative overflow-hidden">
        <ShaderGradient palette="dawn" />
        {/* settle into the page colour */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ivory" />

        <div className="relative mx-auto grid max-w-content grid-cols-1 items-start gap-14 px-6 pb-24 pt-32 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:px-10 lg:pb-28 lg:pt-36">
          {/* left — copy + contact details */}
          <div className="max-w-xl">
            <Reveal y={18} delay={0.05}>
              <Eyebrow>Wir sind für Sie da</Eyebrow>
            </Reveal>
            <h1 className="mt-6 font-playfair text-[clamp(2.6rem,5.5vw,4.2rem)] leading-[1.05] text-charcoal">
              <SplitText text="Kontakt" className="block" delay={0.12} />
              <SplitText
                text="Parliamo di vino."
                className="block italic"
                wordClassName="bg-gradient-to-r from-bordeaux via-wine to-bordeaux bg-clip-text text-transparent"
                delay={0.26}
              />
            </h1>
            <Reveal delay={0.45} y={16}>
              <GrapeRule className="mt-7" />
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-charcoal/75">
                Wir freuen uns auf Ihre Nachricht! Ob eine Verkostung in Düsseldorf, Fragen zu
                unseren Weinen, Partnerschaften oder Händleranfragen – wir sind gerne für Sie da.
              </p>
            </Reveal>

            <Reveal delay={0.58} y={14}>
              <ul className="mt-10 space-y-4">
                {CONTACT.map(({ label, value, href, Icon }) => (
                  <li key={label} className="flex items-center gap-4">
                    <span className="ring-hairline flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cream to-champagne-light/40 text-bordeaux shadow-chip">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] uppercase tracking-[0.18em] text-charcoal/50">
                        {label}
                      </span>
                      {href ? (
                        <a
                          href={href}
                          className="inline-block py-0.5 text-[13.5px] font-medium text-charcoal transition-colors duration-300 hover:text-bordeaux"
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="inline-block py-0.5 text-[13.5px] font-medium text-charcoal">
                          {value}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.7} y={12}>
              <div className="mt-8 flex items-center gap-3">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/15 text-charcoal/70 transition-colors duration-300 hover:border-champagne hover:text-bordeaux"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </div>
              <div className="mt-10 flex max-w-md items-start gap-3.5 rounded-card border border-stone/50 bg-white/50 p-5 shadow-luxe">
                <Clock aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-champagne" />
                <p className="text-[12.5px] leading-relaxed text-charcoal/75">
                  <span className="font-semibold text-charcoal">Unser Versprechen:</span> Wir
                  antworten innerhalb von 1–2 Werktagen auf Ihre Anfrage. Persönlich, ehrlich und mit
                  Leidenschaft für Wein.
                </p>
              </div>
            </Reveal>
          </div>

          {/* right — glass form */}
          <Reveal delay={0.3} y={26}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* ============ HILFE-THEMEN ============ */}
      <section className="relative overflow-hidden">
        <Atmosphere variant="warm" />
        <GhostWord className="right-[-2vw] top-10 text-[11vw]">Benvenuti</GhostWord>
        <div className="relative mx-auto max-w-content px-6 py-24 lg:px-10">
        <SectionTitle
          eyebrow="Ihr Anliegen"
          description="Vier direkte Wege zu uns – wählen Sie einfach das Thema, das zu Ihrer Anfrage passt."
        >
          Womit können wir Ihnen helfen?
        </SectionTitle>
        <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HELP.map((h) => (
            <StaggerItem key={h.title} className="h-full">
              <TiltCard className="group h-full" max={5} radius="rounded-card-lg">
                <div className="ring-hairline flex h-full flex-col rounded-card-lg border border-stone/40 bg-white/70 p-7 shadow-luxe transition-[box-shadow,border-color] duration-500 group-hover:border-champagne/60 group-hover:shadow-lift">
                  <IconChip>{h.icon}</IconChip>
                  <h3 className="mt-6 font-playfair text-[18px] leading-snug text-charcoal">
                    {h.title}
                  </h3>
                  <p className="mt-2.5 text-[12.5px] leading-relaxed text-charcoal/70">{h.text}</p>
                  <a
                    href="#kontakt-formular"
                    className="group/link mt-auto inline-flex min-h-[44px] items-center gap-1.5 pt-5 text-[12px] font-medium text-bordeaux"
                  >
                    Anfrage senden
                    <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover/link:translate-x-1" />
                  </a>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
        </div>
      </section>

      {/* ============ FAQ (Service-Cluster, Index links) + SHOP-CTA ============ */}
      <section className="relative overflow-hidden border-y border-stone/40 bg-gradient-to-b from-cream via-champagne-light/25 to-ivory">
        <Vines className="inset-x-0 bottom-0 h-72 w-full" />
        <Aura tint="blush" drift={2} className="-left-56 -top-44 h-[34rem] w-[34rem]" />
        <FaqSection
          className="relative"
          pageType="kontakt"
          eyebrow="Gut zu wissen"
          title={
            <>
              Häufige <span className="italic text-bordeaux">Fragen.</span>
            </>
          }
          description="Antworten auf die Fragen, die uns am häufigsten erreichen — nach Anliegen sortiert: von Verkostungen in Düsseldorf über Händleranfragen bis zu Shop und Versand."
          groups={KONTAKT_FAQ_GROUPS}
          footer={{ label: "Frage nicht dabei? Schreiben Sie uns", href: "#kontakt-formular" }}
        />

        {/* dark shader shop card + newsletter unter der FAQ */}
        <div className="relative mx-auto grid max-w-content grid-cols-1 items-stretch gap-6 px-6 pb-20 lg:grid-cols-2 lg:px-10 lg:pb-24">
          <Reveal delay={0.1} className="h-full">
            <div className="grain relative h-full min-h-[320px] overflow-hidden rounded-card-lg shadow-luxe">
              <ShaderGradient palette="wine" />
              <div className="relative flex h-full flex-col justify-center p-9 lg:p-12">
                <Eyebrow light>Der offizielle Shop</Eyebrow>
                <h3 className="mt-4 max-w-sm text-balance font-playfair text-[clamp(1.7rem,3vw,2.3rem)] leading-[1.12] text-ivory">
                  Zum offiziellen <span className="italic text-champagne">Maria Maria</span> Shop
                </h3>
                <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-ivory/70">
                  Entdecken Sie unsere Weine und bestellen Sie bequem online im offiziellen Shop.
                </p>
                <div className="mt-8">
                  <Button href="/shop" variant="light">
                    Zum Shop
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.16} className="h-full">
            <NewsletterSignup />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
