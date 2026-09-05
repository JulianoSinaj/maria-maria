"use client";
import Link from "next/link";
import PageShell from "../PageShell";
import InviteForm from "./InviteForm";
import UserList from "./UserList";
import AuditEntries from "../audit/AuditEntries";
import { useAdminI18n } from "../i18n/AdminI18n";

/* The layout of the access page.

   A client component only because the backoffice speaks three languages and
   the dictionary lives in a context — the data it renders was read on the
   server and is handed down whole. Nothing here fetches, decides or writes:
   the forms inside UserList and InviteForm post server actions, and the
   server decides.

   Two columns on wide screens: what you DO on the left (invite, plus the two
   notes that keep expectations straight), what IS on the right (the list, and
   under it the log). On a narrow screen they stack in that same order, which
   is also the order the page gets used in. */

export default function BenutzerView({
  users = [],
  entries = [],
  currentEmail = null,
  mailReady = true,
}) {
  const { t } = useAdminI18n();

  return (
    <PageShell title={t("usersPage.title")} lede={t("usersPage.lede")}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-5">
          <InviteForm mailReady={mailReady} />

          <aside className="space-y-4 rounded-card-lg border border-a-ink/[0.08] bg-a-canvas/60 p-6 text-[12px] leading-relaxed text-a-ink/60">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
                {t("usersPage.remove")}
              </p>
              <p className="mt-2">{t("usersPage.sessionNote")}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
                {t("header.account")}
              </p>
              <p className="mt-2">
                {t("usersPage.passwordNote")}{" "}
                <Link
                  href="/admin/passwort"
                  className="text-a-accent underline decoration-champagne underline-offset-4 transition-colors hover:text-a-accent-deep"
                >
                  {t("usersPage.passwordLink")}
                </Link>
              </p>
            </div>
          </aside>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
              {t("usersPage.listTitle")}
            </h3>
            <UserList users={users} currentEmail={currentEmail} />
          </section>

          <section>
            <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
              {t("audit.title")}
            </h3>
            <p className="mb-3 text-[12.5px] text-a-ink/50">{t("audit.lede")}</p>
            <div className="rounded-card-lg border border-a-ink/[0.08] bg-a-surface/60 px-5 py-1">
              <AuditEntries entries={entries} />
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
