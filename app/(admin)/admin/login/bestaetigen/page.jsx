import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Aura, GhostWord, Vines } from "@/components/Atmosphere";
import { Grapes } from "@/components/Icons";
import { Stemma } from "@/components/Logo";
import { SESSION_COOKIE, sessionSecret, verifySession } from "@/lib/admin/session";
import { peekLink } from "@/lib/admin/magic";
import ConfirmForm from "./ConfirmForm";

/* Where the link from the e-mail lands.

   It does NOT sign anyone in by being opened, and that is the whole point of
   the page existing at all. Mail clients and corporate scanners fetch the
   URLs in a message before a human ever sees it — Outlook's Safe Links is the
   famous one — and a single-use token spent by a scanner is a sign-in that
   fails for the person it was meant for, with no way to explain why. So the
   link only SHOWS something, and a button spends it.

   The token is looked at (peekLink) but not consumed here: the page needs to
   know whether it is worth showing a button, and an expired link deserves the
   sentence that says so rather than a form that will fail.

   Outside the (backoffice) group, like the login form beside it: nobody has
   passed the door yet, so there is no workspace to frame. */

export const metadata = {
  title: "Anmeldung bestätigen — Maria Maria",
  robots: { index: false, follow: false },
};

/* A link is state, and state that is fifteen minutes old must never be served
   from a cache — least of all one that says "still valid". */
export const dynamic = "force-dynamic";

export default async function ConfirmLinkPage({ searchParams }) {
  const secret = sessionSecret();

  /* Already signed in — someone opened an old mail in a browser that still
     holds a session. Nothing to confirm; the backoffice is right there. */
  if (secret && (await verifySession(cookies().get(SESSION_COOKIE)?.value, secret))) {
    redirect("/admin");
  }

  const token = typeof searchParams?.token === "string" ? searchParams.token : "";
  const next = typeof searchParams?.next === "string" ? searchParams.next : "";
  const email = token ? await peekLink(token) : null;

  return (
    <main className="relative flex min-h-[100dvh] items-center overflow-hidden bg-cream text-charcoal">
      <Aura tint="gold" className="-left-40 -top-48 h-[34rem] w-[34rem]" />
      <Aura tint="bordeaux" drift={2} className="-right-48 top-1/4 h-[32rem] w-[32rem]" />
      <GhostWord className="right-[-4vw] bottom-10 text-[16vw] text-charcoal/[0.04]">
        Benvenuta
      </GhostWord>
      <Vines className="inset-x-0 bottom-0 h-64 w-full opacity-60" />

      <div className="relative mx-auto w-full max-w-[460px] px-6 py-16">
        <Stemma className="w-12" />

        <span className="mt-8 inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-bordeaux/55">
          <Grapes className="h-4 w-4" />
          Backoffice
        </span>

        {email ? (
          <>
            <h1 className="mt-5 font-playfair text-[clamp(1.9rem,4vw,2.4rem)] leading-[1.1] text-charcoal">
              Willkommen <span className="italic text-bordeaux">zurück</span>
            </h1>
            <p className="mt-4 text-[13px] leading-relaxed text-charcoal/60">
              Dieser Link gehört zu <span className="font-medium text-charcoal">{email}</span>.
              Ein Klick, und Sie sind angemeldet — danach verfällt er.
            </p>
            <ConfirmForm token={token} next={next} />
          </>
        ) : (
          <>
            <h1 className="mt-5 font-playfair text-[clamp(1.9rem,4vw,2.4rem)] leading-[1.1] text-charcoal">
              Dieser Link ist <span className="italic text-bordeaux">verbraucht</span>
            </h1>
            <p className="mt-4 text-[13px] leading-relaxed text-charcoal/60">
              Anmeldelinks gelten fünfzehn Minuten und lassen sich genau einmal
              verwenden — das ist Absicht: eine E-Mail wird weitergeleitet,
              gesichert und aufbewahrt, ein Link darin darf deshalb nicht
              dauerhaft eine Tür sein.
            </p>
            <Link
              href="/admin/login"
              className="group mt-8 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-br from-bordeaux to-wine px-7 py-3.5 text-[12.5px] font-medium uppercase tracking-[0.14em] text-ivory shadow-chip transition-transform duration-500 ease-out-expo hover:-translate-y-0.5"
            >
              Neuen Link anfordern
            </Link>
          </>
        )}

        <p className="mt-12 border-t border-charcoal/[0.08] pt-6 text-[11.5px] text-charcoal/45">
          <a
            href="/"
            className="underline decoration-champagne underline-offset-4 transition-colors hover:text-bordeaux"
          >
            Zurück zur Website
          </a>
        </p>
      </div>
    </main>
  );
}
