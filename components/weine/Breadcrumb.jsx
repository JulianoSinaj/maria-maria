import Link from "next/link";

/* Sichtbare Brotkrume über dem Hero — Pflichtelement der Landing-Guide
   (Orientierung, internes Linking, BreadcrumbList).

   Liest wine.breadcrumb, dieselbe Quelle wie das JSON-LD in der Route: so
   sagen Markup und sichtbarer Inhalt immer dasselbe. Der letzte Schritt ist
   die aktuelle Seite und trägt deshalb keinen Link, sondern
   aria-current="page".

   Bewusst flach gehalten: die Brotkrume soll die Seite eröffnen, nicht mit
   dem Hero um Aufmerksamkeit konkurrieren. */

export default function Breadcrumb({ wine }) {
  const trail = wine.breadcrumb ?? [];
  if (!trail.length) return null;

  return (
    <nav
      aria-label="Brotkrumennavigation"
      className="relative z-10 mx-auto max-w-content px-6 pt-24 sm:pt-28 lg:px-10"
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] tracking-[0.08em] text-charcoal/55">
        {trail.map((step, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={`${step.label}-${i}`} className="flex items-center gap-2">
              {step.href && !last ? (
                <Link
                  href={step.href}
                  className="rounded-sm underline-offset-4 transition-colors hover:text-bordeaux hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordeaux"
                >
                  {step.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="text-charcoal/80">
                  {step.label}
                </span>
              )}
              {!last && (
                <span aria-hidden="true" className="text-charcoal/30">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
