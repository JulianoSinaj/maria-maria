import Link from "next/link";
import { Aura, GhostWord, Vines } from "@/components/Atmosphere";
import { Grapes } from "@/components/Icons";
import { Stemma } from "@/components/Logo";
import { Overview } from "@/components/admin/AdminIcons";

/* 404 for the backoffice.

   It sits directly under /admin and therefore OUTSIDE the (backoffice) group:
   Next resolves a missing page against the deepest segment it could match —
   for /admin/portfoli that is "admin" — so this is the file it reaches. A
   copy inside the group would never be found.

   Without the group it also renders without AdminShell, and on purpose: the
   rail promises five sections, and a 404 is the one moment where the promise
   is worth less than a single clear way back. The page therefore shares its
   look with /admin/login — the two pages that stand outside the workspace
   look like each other, not like a half-working workspace.

   Same rule as the storefront's 404: no dead end, always one way out. */

export default function AdminNotFound() {
  return (
    <main className="relative flex min-h-[100dvh] items-center overflow-hidden bg-cream text-charcoal">
      <Aura tint="gold" className="-left-40 -top-48 h-[34rem] w-[34rem]" />
      <Aura tint="bordeaux" drift={2} className="-right-48 top-1/4 h-[32rem] w-[32rem]" />
      <GhostWord className="right-[-6vw] top-8 text-[22vw]">404</GhostWord>
      <Vines className="inset-x-0 bottom-0 h-72 w-full opacity-60" />

      <div className="relative mx-auto w-full max-w-[560px] px-6 py-20 text-center">
        <Stemma className="mx-auto w-12" />

        <span className="mt-8 inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-bordeaux/55">
          <Grapes className="h-4 w-4" />
          Backoffice · Fehler 404
        </span>

        <h1 className="mx-auto mt-5 max-w-[18ch] text-balance font-playfair text-[clamp(1.9rem,4.5vw,2.9rem)] leading-[1.1] text-charcoal">
          Diesen Bereich gibt es <span className="italic text-bordeaux">nicht</span>.
        </h1>

        <p className="mx-auto mt-5 max-w-[46ch] text-[13.5px] leading-relaxed text-charcoal/60">
          Die Adresse führt ins Leere — vertippt oder aus einem alten Lesezeichen.
          Die Übersicht kennt jeden Bereich, den es wirklich gibt.
        </p>

        <Link
          href="/admin"
          className="group mt-9 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-br from-bordeaux to-wine px-7 py-3.5 text-[12.5px] font-medium uppercase tracking-[0.14em] text-ivory shadow-chip transition-transform duration-500 ease-out-expo hover:-translate-y-0.5"
        >
          <Overview className="h-[17px] w-[17px]" />
          Zur Übersicht
        </Link>

        <p className="mt-12 text-[10.5px] uppercase tracking-[0.22em] text-charcoal/35">
          Maria Maria · Administration
        </p>
      </div>
    </main>
  );
}
