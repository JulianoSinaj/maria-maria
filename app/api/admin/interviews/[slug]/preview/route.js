import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { toLocale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/routing";
import { interviewPath } from "@/components/magazin/interviewPath";

/* The preview link for drafts.

   Next's Draft Mode is built for exactly this: enable() sets a bypass
   cookie, and with that cookie the article route renders on request
   instead of from the static cache — so the desk sees the current record,
   drafts included, while every other visitor keeps the cached, published
   version and a 404 for drafts. No query parameter on the storefront
   (reading one would make the whole route dynamic for everyone), no second
   copy of the article component under /admin.

   Reachable only with a backoffice session — the middleware guards
   /api/admin, and this route redirects out of it with the cookie in hand. */
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const locale = toLocale(request.nextUrl.searchParams.get("locale") ?? "de");
  draftMode().enable();
  redirect(localePath(locale, interviewPath(params.slug)));
}
