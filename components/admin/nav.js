/* Single source of truth for the admin sidebar, the header breadcrumb and the
   mobile drawer. Order here is the order in the UI.

   `key` addresses the dictionary (components/admin/i18n/dictionary.js):
   label = t(`nav.${key}.label`), hint = t(`nav.${key}.hint`). */

export const ADMIN_NAV = [
  {
    href: "/admin",
    key: "overview",
    icon: "overview",
    /* only /admin itself — every other section would match a prefix test */
    exact: true,
  },
  {
    href: "/admin/portfolio",
    key: "portfolio",
    icon: "bottle",
  },
  {
    href: "/admin/regionen",
    key: "regions",
    icon: "map",
  },
  {
    href: "/admin/seiten",
    key: "pages",
    icon: "pages",
  },
  {
    href: "/admin/faq",
    key: "faq",
    icon: "faq",
  },
  {
    href: "/admin/media",
    key: "media",
    icon: "media",
  },
  {
    href: "/admin/magazin",
    key: "magazine",
    icon: "magazine",
  },
  {
    href: "/admin/rechtstexte",
    key: "legal",
    icon: "legal",
  },
  {
    href: "/admin/anfragen",
    key: "inquiries",
    icon: "inbox",
  },
  {
    href: "/admin/benutzer",
    key: "users",
    icon: "users",
    /* Hidden for the same reason as the password: the rail lists what the
       WEBSITE is made of, and a colleague is not a part of the website. Both
       are reached from the account menu in the header — but they still belong
       in this list, so the header knows what to call itself while the page is
       open. Only owners ever see them; the middleware turns everyone else
       away (OWNER_ONLY in middleware.js). */
    hidden: true,
  },
  {
    href: "/admin/einstellungen",
    key: "settings",
    icon: "settings",
  },
  {
    href: "/admin/passwort",
    key: "password",
    icon: "lock",
    /* Not in the rail: the rail lists what the site is made of, and an
       account setting is not a part of the website. It is reached from the
       user chip in the header — but it still belongs in this list, so the
       header knows what to call itself while the page is open. */
    hidden: true,
  },
];

/* What the rail and the drawer actually show. */
export const ADMIN_SECTIONS = ADMIN_NAV.filter((item) => !item.hidden);

/* Longest-prefix match so /admin/portfolio/[slug] still lights up its section
   while /admin stays exact. */
export function activeNavItem(pathname) {
  let best = null;
  for (const item of ADMIN_NAV) {
    const hit = item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);
    if (hit && (!best || item.href.length > best.href.length)) best = item;
  }
  return best;
}
