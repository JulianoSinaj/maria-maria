"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Menu } from "@/components/Icons";
import { Search, Bell, Sidebar, Logout } from "./AdminIcons";
import { signOut } from "@/lib/admin/actions";
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
  hideSearch = false,
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
          {/* Sections that own a working search (Portfolio) suppress this one —
              a second box that filters nothing reads as broken. Global search
              is not wired up yet, so it only shows where nothing better exists. */}
          {!hideSearch && (
            <label className="relative hidden md:block">
              <span className="sr-only">{t("header.searchSr")}</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-a-ink/35" />
              <input
                type="search"
                placeholder={t("header.searchPlaceholder")}
                className="h-10 w-[190px] rounded-full border border-a-ink/12 bg-a-surface/70 pl-10 pr-4 text-[12.5px] text-a-ink transition-[width,border-color] duration-500 ease-out-expo placeholder:text-a-ink/35 focus:w-[240px] focus:border-champagne focus:outline-none xl:w-[220px] xl:focus:w-[280px]"
              />
            </label>
          )}

          {/* colour scheme: light / dark / auto — on phones it lives in the drawer */}
          <AdminThemeSwitcher className="hidden sm:flex" />

          {/* language: DE / IT / EN — on phones it lives in the drawer */}
          <AdminLanguageSwitcher className="hidden sm:flex" />

          <button
            type="button"
            aria-label={t("header.notifications")}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-a-ink/12 text-a-ink/70 transition-colors hover:border-champagne hover:text-a-accent"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span
              aria-hidden="true"
              className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-a-fill ring-2 ring-a-canvas"
            />
          </button>

          <span
            aria-hidden="true"
            className="hidden h-7 w-px bg-a-ink/10 sm:block"
          />

          {/* The chip was a button that did nothing. It is now the way to the
              one page that belongs to the person rather than to the site. */}
          <Link
            href="/admin/passwort"
            title={t("header.account")}
            className="group flex items-center gap-2.5 rounded-full border border-a-ink/12 py-1 pl-1 pr-1 transition-colors hover:border-champagne sm:pr-4"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 font-playfair text-[13px] italic text-ivory">
              A
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-[12px] font-medium leading-tight text-a-ink">
                {t("header.userName")}
              </span>
              <span className="block text-[10px] leading-tight tracking-[0.06em] text-a-ink/45">
                {t("header.account")}
              </span>
            </span>
          </Link>

          {/* Sign out. A form and not a link, because a GET that ends a
              session can be triggered by any <img src> on a foreign page —
              and because without JavaScript a button still posts. */}
          <form action={signOut}>
            <button
              type="submit"
              aria-label={t("header.signOut")}
              title={t("header.signOut")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-a-ink/12 text-a-ink/70 transition-colors hover:border-champagne hover:text-a-accent"
            >
              <Logout className="h-[18px] w-[18px]" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
