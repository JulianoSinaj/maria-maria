import Link from "@/components/i18n/LocaleLink";
import Photo from "@/components/media/Photo";
import { Arrow } from "@/components/Icons";

export default function StoryCta() {
  return (
    <section aria-label="Weiter zu den Regionen" className="relative">
      <Link href="/regionen" className="group relative block overflow-hidden bg-bordeaux-deep">
        {/* das Panorama als volle Ebene — die Flaschenreihe verläuft
            waagerecht und verträgt den breiten, flachen Beschnitt */}
        <div aria-hidden="true" className="absolute inset-0">
          <Photo
            src="/img/weine/hero.jpg"
            alt=""
            sizes="100vw"
            className="h-full w-full object-cover object-[center_38%] transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
          />
          {/* erst in den Markenton stimmen, dann links zum Text-Grund decken */}
          <div aria-hidden="true" className="absolute inset-0 bg-bordeaux-deep/55 mix-blend-multiply" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-bordeaux-deep via-bordeaux-deep/90 to-bordeaux-deep/15 sm:via-45%"
          />
        </div>

        <div className="relative mx-auto flex max-w-content items-center gap-5 px-6 py-10 sm:py-12 lg:px-10">
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:pr-[30%]">
            <span className="font-playfair text-[clamp(1.15rem,2.4vw,1.7rem)] leading-snug text-ivory">
              Jeder Wein beginnt an einem Ort. Seine Geschichte wird am Tisch weitergeschrieben.
            </span>
            <Arrow
              aria-hidden="true"
              className="h-5 w-5 text-champagne transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5"
            />
          </span>
        </div>
      </Link>
    </section>
  );
}
