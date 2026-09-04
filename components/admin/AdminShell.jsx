"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminMobileNav from "./AdminMobileNav";
import AdminHeader from "./AdminHeader";
import { AdminUserProvider } from "./AdminUser";
import { activeNavItem } from "./nav";

/* The admin frame: fixed-height viewport with an independently scrolling
   content column, so the rail and header never scroll away.

   Active state is resolved once here and handed down — the sidebar, the drawer
   and the header title all read from the same match, so they can't disagree. */

const COLLAPSE_KEY = "mm-admin-rail-collapsed";

export default function AdminShell({ user = null, children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const navTriggerRef = useRef(null);

  /* Read the stored preference after mount — reading localStorage during
     render would desync server and client markup. */
  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      /* private mode / storage disabled — keep the expanded default */
    }
  }, []);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        /* non-fatal: the rail still toggles for this session */
      }
      return next;
    });
  };

  // close the drawer whenever navigation lands somewhere new
  useEffect(() => setNavOpen(false), [pathname]);

  const active = activeNavItem(pathname);
  const isActive = (item) => item.href === active?.href;

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-a-canvas text-a-ink">
      <AdminSidebar collapsed={collapsed} isActive={isActive} />

      <AdminMobileNav
        open={navOpen}
        onClose={() => setNavOpen(false)}
        isActive={isActive}
        triggerRef={navTriggerRef}
      />

      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* ambient warmth behind the workspace — purely decorative */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-40 h-[420px] w-[420px] rounded-full bg-champagne/18 blur-3xl" />
          <div className="absolute -right-40 top-1/3 h-[380px] w-[380px] rounded-full bg-a-accent/[0.07] blur-3xl" />
        </div>

        <AdminHeader
          section={active}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
          onOpenNav={() => setNavOpen(true)}
          navTriggerRef={navTriggerRef}
          /* resolved on the server from the session cookie — the shell is a
             client component and cannot read an httpOnly cookie itself */
          user={user}
          /* portfolio and inquiries carry their own search boxes */
          hideSearch={
            pathname.startsWith("/admin/portfolio") || pathname.startsWith("/admin/anfragen")
          }
        />

        {/* data-lenis-prevent: the storefront's smooth scroll must not hijack
            this column — the admin scrolls natively */}
        <main
          id="admin-main"
          data-lenis-prevent
          className="relative flex-1 overflow-y-auto overscroll-contain px-5 pb-14 pt-7 sm:px-7 lg:px-9"
        >
          {/* the signed-in person, once, for every card that wants to know
              what to offer — see components/admin/AdminUser.jsx */}
          <AdminUserProvider user={user}>{children}</AdminUserProvider>
        </main>
      </div>
    </div>
  );
}
