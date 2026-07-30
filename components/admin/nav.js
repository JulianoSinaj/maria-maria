/* Single source of truth for the admin sidebar, the header breadcrumb and the
   mobile drawer. Order here is the order in the UI. */

export const ADMIN_NAV = [
  {
    href: "/admin",
    label: "Übersicht",
    hint: "Kennzahlen & Aktivität",
    icon: "overview",
    /* only /admin itself — every other section would match a prefix test */
    exact: true,
  },
  {
    href: "/admin/portfolio",
    label: "Weinportfolio",
    hint: "Kollektion & Bestand",
    icon: "bottle",
  },
  {
    href: "/admin/regionen",
    label: "Regionen-Storytelling",
    hint: "Herkunft & Erzählung",
    icon: "map",
  },
  {
    href: "/admin/media",
    label: "Hero & Media",
    hint: "Bildwelten & Video",
    icon: "media",
  },
  {
    href: "/admin/bestellungen",
    label: "Bestellungen",
    hint: "Aufträge & Versand",
    icon: "orders",
  },
];

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
