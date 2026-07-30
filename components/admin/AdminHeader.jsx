"use client";
import { motion, useReducedMotion } from "motion/react";
import { Menu } from "@/components/Icons";
import { Search, Bell, Sidebar } from "./AdminIcons";

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

  return (
    <header className="sticky top-0 z-30 border-b border-charcoal/[0.07] bg-cream/85 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex h-[76px] items-center gap-4 px-5 sm:px-7 lg:px-9">
        {/* mobile drawer trigger */}
        <button
          ref={navTriggerRef}
          type="button"
          onClick={onOpenNav}
          aria-label="Navigation öffnen"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-charcoal/12 text-charcoal transition-colors hover:border-champagne hover:text-bordeaux lg:hidden"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>

        {/* desktop rail collapse */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Seitenleiste ausklappen" : "Seitenleiste einklappen"}
          aria-pressed={collapsed}
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-charcoal/12 text-charcoal/70 transition-colors hover:border-champagne hover:text-bordeaux lg:flex"
        >
          <Sidebar className="h-[18px] w-[18px]" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-bordeaux/55">
            {section?.hint ?? "Redaktion"}
          </p>
          {/* key on href so the title re-runs its rise on every section change */}
          <motion.h1
            key={section?.href ?? "admin"}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="truncate font-playfair text-[21px] leading-tight text-charcoal sm:text-[24px]"
          >
            {section?.label ?? "Administration"}
          </motion.h1>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          {/* Sections that own a working search (Portfolio) suppress this one —
              a second box that filters nothing reads as broken. Global search
              is not wired up yet, so it only shows where nothing better exists. */}
          {!hideSearch && (
            <label className="relative hidden md:block">
              <span className="sr-only">Im Adminbereich suchen</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-charcoal/35" />
              <input
                type="search"
                placeholder="Suchen …"
                className="h-10 w-[190px] rounded-full border border-charcoal/12 bg-ivory/70 pl-10 pr-4 text-[12.5px] text-charcoal transition-[width,border-color] duration-500 ease-out-expo placeholder:text-charcoal/35 focus:w-[240px] focus:border-champagne focus:outline-none xl:w-[220px] xl:focus:w-[280px]"
              />
            </label>
          )}

          <button
            type="button"
            aria-label="Benachrichtigungen"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-charcoal/12 text-charcoal/70 transition-colors hover:border-champagne hover:text-bordeaux"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span
              aria-hidden="true"
              className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-bordeaux ring-2 ring-cream"
            />
          </button>

          <span
            aria-hidden="true"
            className="hidden h-7 w-px bg-charcoal/10 sm:block"
          />

          <button
            type="button"
            className="group flex items-center gap-2.5 rounded-full border border-charcoal/12 py-1 pl-1 pr-1 transition-colors hover:border-champagne sm:pr-4"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-bordeaux to-wine font-playfair text-[13px] italic text-ivory">
              A
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-[12px] font-medium leading-tight text-charcoal">
                Admin
              </span>
              <span className="block text-[10px] leading-tight tracking-[0.06em] text-charcoal/45">
                Redaktion
              </span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
