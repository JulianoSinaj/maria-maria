import Link from "@/components/i18n/LocaleLink";
import { Reveal } from "@/components/motion/Reveal";
import { Arrow } from "@/components/Icons";
import Photo from "@/components/media/Photo";

const DEFAULT_COPY = {
  eyebrow: "The owner · Wine import & selection",
  title: "Valerio Caniglia: the entrepreneur behind Maria Maria",
  paragraphs: [
    "Valerio Caniglia brings more than 30 years of experience in the wine business. He understands markets, people and wines, and selects with a sure instinct the producers who fit Maria Maria.",
    "With sensitivity, reliability and an international network, he ensures that every bottle brings our values into the glass.",
  ],
  cta: "Maria Maria for restaurants and specialist retail",
  href: "/kontakt",
  imageLabel: "Portrait of Valerio Caniglia",
};

export default function ValerioSection({ id = "salento", t = {} }) {
  const copy = { ...DEFAULT_COPY, ...t };
  const paragraphs = copy.paragraphs ?? DEFAULT_COPY.paragraphs;

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative overflow-hidden bg-[#30060B]">
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-9 px-6 py-8 sm:gap-12 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10 lg:py-12">
        <Reveal y={16} className="lg:order-2">
          <figure className="mx-auto aspect-[1024/725] w-full max-w-[640px] overflow-hidden rounded-card-lg border border-champagne/35 bg-bordeaux/20">
            <Photo
              src="/img/magazin/valerino.jpeg"
              alt={copy.imageLabel}
              sizes="(min-width: 1024px) 640px, 100vw"
              className="h-full w-full object-cover object-center"
            />
          </figure>
        </Reveal>

        <Reveal y={16} delay={0.08} className="lg:order-1">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-champagne-light/85">
              {copy.eyebrow}
            </p>
            <h2
              id={`${id}-title`}
              className="mt-4 text-balance font-playfair text-[clamp(1.8rem,3.8vw,3rem)] leading-[1.08] text-ivory"
            >
              {copy.title}
            </h2>
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-5 max-w-[58ch] text-[13.5px] leading-relaxed text-ivory/75">
                {paragraph}
              </p>
            ))}
            <Link
              href={copy.href}
              className="group mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-champagne/55 px-5 py-2.5 text-[12px] font-semibold text-ivory transition-colors duration-300 hover:border-champagne hover:bg-bordeaux"
            >
              {copy.cta}
              <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
