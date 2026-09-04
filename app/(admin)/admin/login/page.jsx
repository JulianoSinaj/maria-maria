import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Aura, GhostWord, Vines } from "@/components/Atmosphere";
import { Grapes } from "@/components/Icons";
import { Stemma } from "@/components/Logo";
import { SESSION_COOKIE, sessionSecret, verifySession } from "@/lib/admin/session";
import { credentialExists } from "@/lib/admin/credentials";
import { hasUsers } from "@/lib/admin/users";
import LoginForm from "./LoginForm";

/* The door to the backoffice.

   It sits at /admin/login but deliberately OUTSIDE the (backoffice) route
   group, so it does not inherit AdminShell: a sidebar with five sections
   behind a form that nobody has passed yet promises access that does not
   exist, and every one of its links would bounce straight back here. The
   group is the whole reason the other admin routes moved one folder down —
   see (backoffice)/layout.jsx.

   The middleware lets this whole area through unchecked (LOGIN_PATH in
   middleware.js). Everything the page shows is therefore public by
   definition, which is why it says nothing about who may sign in, whether a
   particular address is on the list, or what the password looks like. The
   two doors it offers are decided by what the deployment HAS, never by who
   is looking: an address on the allowlist means links can be sent, a stored
   or handover password means the password form is worth showing. */

export const metadata = {
  title: "Anmeldung — Maria Maria",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({ searchParams }) {
  /* Two different ways for this deployment to be unusable, and the form can
     do nothing about either. Saying so beats a password field that refuses
     every entry without a reason — the fix is in the hosting panel or in the
     data volume, never in the form.

       no secret      – ADMIN_SESSION_SECRET and ADMIN_PASSWORD both missing;
                        the middleware is already answering 503 everywhere else
       no way in      – a signing key, but neither a password to check nor a
                        single address that could be sent a link: the data
                        volume is gone (a deploy without a persistent one) and
                        ADMIN_PASSWORD was removed after the handover */
  const secret = sessionSecret();
  const [hasCredential, someoneListed] = await Promise.all([credentialExists(), hasUsers()]);

  /* Already signed in: skip the form. Reached by anyone who bookmarked the
     login page, or who lands here through a stale ?next link. */
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (secret && (await verifySession(token, secret))) {
    redirect("/admin");
  }

  const configured = Boolean(secret) && (hasCredential || someoneListed);

  const next = typeof searchParams?.next === "string" ? searchParams.next : "";

  return (
    <div className="grid min-h-[100dvh] bg-cream text-charcoal lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)]">
      {/* --- Left: the house. Decoration only, hidden where it would squeeze
          the form into a corner. --- */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-bordeaux-deep via-bordeaux to-wine text-ivory lg:flex lg:flex-col lg:justify-between">
        <Aura tint="gold" className="-left-40 -top-40 h-[34rem] w-[34rem]" />
        <Aura tint="blush" drift={2} className="-right-48 top-1/3 h-[32rem] w-[32rem]" />
        <GhostWord className="-right-10 bottom-24 text-[13vw] text-ivory/[0.07]">
          Manduria
        </GhostWord>
        <Vines className="inset-x-0 bottom-0 h-64 w-full" stroke="rgba(247, 244, 239, 0.18)" />

        <div className="relative p-12 xl:p-16">
          <Stemma className="w-14" />
        </div>

        <div className="relative p-12 xl:p-16">
          <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-champagne-light">
            <Grapes className="h-4 w-4" />
            Backoffice
          </span>
          <p className="mt-5 max-w-[22ch] text-balance font-playfair text-[clamp(2rem,3vw,2.9rem)] leading-[1.12]">
            Der Keller hinter <span className="italic text-champagne-light">dem Laden</span>.
          </p>
          <p className="mt-5 max-w-[42ch] text-[13px] leading-relaxed text-ivory/65">
            Bestand, Bilder, Regionen und Bestellungen — alles, was die Website
            zeigt, wird hier gepflegt.
          </p>
        </div>

        <p className="relative px-12 pb-10 text-[10.5px] uppercase tracking-[0.22em] text-ivory/35 xl:px-16">
          Maria Maria · Vini di Manduria
        </p>
      </aside>

      {/* --- Right: the form. --- */}
      <main className="relative flex items-center justify-center px-6 py-14 sm:px-10">
        {/* the same ambient warmth the workspace has behind it */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full bg-champagne/20 blur-3xl" />
          <div className="absolute -left-40 bottom-0 h-[360px] w-[360px] rounded-full bg-bordeaux/[0.06] blur-3xl" />
        </div>

        <div className="relative w-full max-w-[400px]">
          {/* brand mark for the narrow layout, where the left panel is gone */}
          <div className="mb-9 flex items-center gap-3 lg:hidden">
            <Stemma className="w-10" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-bordeaux/60">
              Backoffice
            </span>
          </div>

          <h1 className="font-playfair text-[clamp(1.9rem,4vw,2.4rem)] leading-[1.1] text-charcoal">
            Willkommen <span className="italic text-bordeaux">zurück</span>
          </h1>
          <p className="mt-3 text-[13px] leading-relaxed text-charcoal/60">
            Bitte melden Sie sich an, um die Inhalte der Website zu bearbeiten.
          </p>

          {configured ? (
            <LoginForm next={next} canLink={someoneListed} canPassword={hasCredential} />
          ) : (
            <p
              role="alert"
              className="mt-9 rounded-2xl border border-bordeaux/20 bg-bordeaux/[0.05] px-5 py-4 text-[12.5px] leading-relaxed text-bordeaux"
            >
              {secret ? (
                <>
                  Für dieses Backoffice ist weder ein Passwort hinterlegt noch
                  eine Adresse eingetragen, an die ein Anmeldelink gehen
                  könnte. Eine Anmeldung ist erst wieder möglich, wenn in der
                  Umgebung ein
                  <code className="mx-1 font-montserrat text-[12px]">ADMIN_PASSWORD</code>
                  als Startpasswort oder eine
                  <code className="mx-1 font-montserrat text-[12px]">ADMIN_ALLOWLIST</code>
                  gesetzt wird.
                </>
              ) : (
                <>
                  Das Backoffice ist nicht konfiguriert: In der Umgebung fehlt
                  <code className="mx-1 font-montserrat text-[12px]">ADMIN_SESSION_SECRET</code>
                  (ersatzweise
                  <code className="mx-1 font-montserrat text-[12px]">ADMIN_PASSWORD</code>).
                </>
              )}
            </p>
          )}

          <p className="mt-10 border-t border-charcoal/[0.08] pt-6 text-[11.5px] text-charcoal/45">
            <a
              href="/"
              className="underline decoration-champagne underline-offset-4 transition-colors hover:text-bordeaux"
            >
              Zurück zur Website
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
