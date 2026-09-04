"use client";
import Link from "next/link";
import PageShell from "@/components/admin/PageShell";
import InterviewEditor from "@/components/admin/magazin/InterviewEditor";
import { useAdminI18n } from "@/components/admin/i18n/AdminI18n";

/* The interview editor's route. Client-rendered like the rest of the
   backoffice's editors (portfolio, FAQ): the record comes from the API via
   lib/interviews/useInterviews, not from a server fetch, so save/publish
   can update it in place without a navigation. */

export default function InterviewEditorPage({ params }) {
  const { t } = useAdminI18n();

  return (
    <PageShell
      title={t("magazine.editor.title")}
      lede={t("magazine.editor.lede")}
      actions={
        <Link href="/admin/magazin" className="text-[12px] text-a-ink/55 transition-colors hover:text-a-accent">
          {t("magazine.editor.backToList")}
        </Link>
      }
    >
      <InterviewEditor slug={params.slug} />
    </PageShell>
  );
}
