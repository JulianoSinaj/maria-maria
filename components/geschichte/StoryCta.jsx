import Link from "next/link";
import Photo from "@/components/media/Photo";
import { Arrow } from "@/components/Icons";

/* Das Schlussband der Geschichte — ein Bordeaux-Passaggio wie der Fuß des
   Magazins. Das Kollektions-Panorama (die neun Flaschen im Abendlicht)
   liegt als volle Ebene UNTER dem Band: links deckt ein langer
   Bordeaux-Verlauf es zu Text-Grund ab, nach rechts tauchen die Flaschen
   aus dem Dunkel auf — keine harte Bildkante, kein Zoom-Ausschnitt.
   Das ganze Band ist der Link; beim Zeigen rückt der Pfeil vor, das
   Panorama zieht sich sacht auf und die Flaschen-Marke hebt sich. */

function BottleMark({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.2 2.75h3.6v4.1c0 .9 2.45 1.55 2.45 4.05v8.6a1.75 1.75 0 0 1-1.75 1.75h-5a1.75 1.75 0 0 1-1.75-1.75v-8.6c0-2.5 2.45-3.15 2.45-4.05v-4.1Z"
      />
      <path strokeLinecap="round" d="M8.9 13.4h6.2" />
    </svg>
  );
}

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
          {/* die Flaschen-Marke im Haarlinien-Rahmen */}
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-champagne/45 text-champagne-light transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5">
            <BottleMark className="h-6 w-6" />
          </span>
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:pr-[30%]">
            <span className="font-playfair text-[clamp(1.15rem,2.4vw,1.7rem)] leading-snug text-ivory">
              Die Reise durch die Regionen entdecken
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
