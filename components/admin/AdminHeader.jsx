"use client";
import { motion, useReducedMotion } from "motion/react";
import { Menu } from "@/components/Icons";
import { Sidebar } from "./AdminIcons";
import AdminSearch from "./AdminSearch";
import AdminNotifications from "./AdminNotifications";
import AdminUserChip from "./AdminUserChip";
import AdminLanguageSwitcher from "./AdminLanguageSwitcher";
import AdminThemeSwitcher from "./AdminThemeSwitcher";
import { useAdminI18n } from "./i18n/AdminI18n";

/* Sticky header for the content column. Title/eyebrow are driven by the active
   nav item so a new section never needs to re-declare its own header. */

export default function AdminHeader({
  section,
  collapsed,
  onToggleCollapse,
  onOpenNav,
  navTriggerRef,
  user = null,
}) {
  const reduced = useReducedMotion();
  const { t, locale } = useAdminI18n();

  return (
    <header className="sticky top-0 z-30 border-b border-a-ink/[0.07] bg-a-canvas/85 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex h-[76px] items-center gap-4 px-5 sm:px-7 lg:px-9">
        {/* mobile drawer trigger */}
        <button
          ref={navTriggerRef}
          type="button"
          onClick={onOpenNav}
          aria-label={t("nav.open")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-a-ink/12 text-a-ink transition-colors hover:border-champagne hover:text-a-accent lg:hidden"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>

        {/* desktop rail collapse */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? t("header.expandRail") : t("header.collapseRail")}
          aria-pressed={collapsed}
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-a-ink/12 text-a-ink/70 transition-colors hover:border-champagne hover:text-a-accent lg:flex"
        >
          <Sidebar className="h-[18px] w-[18px]" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-a-accent/55">
            {section ? t(`nav.${section.key}.hint`) : t("header.defaultHint")}
          </p>
          {/* key on href + locale so the title re-runs its rise on every
              section change and on a language switch */}
          <motion.h1
            key={`${section?.href ?? "admin"}-${locale}`}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="truncate font-playfair text-[21px] leading-tight text-a-ink sm:text-[24px]"
          >
            {section ? t(`nav.${section.key}.label`) : t("header.defaultTitle")}
          </motion.h1>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          {/* Global search — wines, inquiries, FAQ entries and interviews.
              It stands on every section on purpose: the section boxes narrow
              a list, this one jumps to a record, and a chrome element that
              disappears on two pages (plus a ⌘K that then does nothing) reads
              as a bug. See AdminSearch.jsx. */}
          <AdminSearch className="hidden md:block" />

          {/* colour scheme: light / dark / auto — on phones it lives in the drawer */}
          <AdminThemeSwitcher className="hidden sm:flex" />

          {/* language: DE / IT / EN — on phones it lives in the drawer */}
          <AdminLanguageSwitcher className="hidden sm:flex" />

          {/* The bell rings for what is actually waiting: unanswered
              inquiries, wines out of or low on stock, unpublished drafts —
              and the dot goes out once they have been looked at. */}
          <AdminNotifications />

          <span
            aria-hidden="true"
            className="hidden h-7 w-px bg-a-ink/10 sm:block"
          />

          {/* Who is signed in — and the way out. Both used to be missing: the
              chip said "Admin" over the letter A because there was one shared
              password and nobody to name. */}
          <AdminUserChip user={user} />
        </div>
      </div>
    </header>
  );
}
