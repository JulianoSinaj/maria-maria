"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Logo from "@/components/Logo";
import { ADMIN_SECTIONS } from "./nav";
import { ICONS } from "./AdminIcons";

/* Desktop rail. The active pill is a single shared element (layoutId) that
   springs between items instead of one fading in per link — the highlight
   reads as one object moving, which is what makes section changes feel
   spatial rather than switched.

   Collapsed mode animates the rail's own width; labels cross-fade out. The
   icon column never moves, so nothing inside a row shifts. */

const RAIL_SPRING = { type: "spring", stiffness: 320, damping: 34, mass: 0.8 };

export default function AdminSidebar({ collapsed = false, isActive }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <motion.aside
      animate={{ width: collapsed ? 84 : 276 }}
      initial={false}
      transition={reduced ? { duration: 0 } : RAIL_SPRING}
      className="relative z-20 hidden shrink-0 flex-col overflow-hidden border-r border-ivory/10 bg-gradient-to-b from-espresso via-[#2a1a15] to-bordeaux-deep lg:flex"
    >
      {/* champagne hairline down the trailing edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-champagne/35 to-transparent"
      />

      <div className={`flex h-20 items-center ${collapsed ? "justify-center px-0" : "px-7"}`}>
        <Link href="/admin" aria-label="Maria Maria Admin — Übersicht" className="block shrink-0">
          {collapsed ? (
            <span className="font-playfair text-[22px] italic leading-none text-champagne">M</span>
          ) : (
            /* the logo is a dark-on-light PNG — invert it onto the espresso rail */
            <Logo className="h-auto w-[104px] brightness-0 invert" />
          )}
        </Link>
      </div>

      {!collapsed && (
        <p className="px-7 pb-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-champagne/60">
          Redaktion
        </p>
      )}

      <nav
        aria-label="Admin-Navigation"
        className="flex flex-1 flex-col gap-1 px-3 pb-6"
      >
        {ADMIN_SECTIONS.map((item) => {
          const Icon = ICONS[item.icon];
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center rounded-2xl outline-offset-4 transition-colors duration-300 ${
                collapsed ? "justify-center px-0 py-3" : "gap-3.5 px-4 py-3"
              } ${active ? "text-ivory" : "text-ivory/70 hover:text-ivory"}`}
            >
              {active && (
                <motion.span
                  layoutId="admin-nav-pill"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-2xl border border-champagne/25 bg-gradient-to-r from-champagne/20 via-champagne/10 to-transparent"
                  transition={reduced ? { duration: 0 } : RAIL_SPRING}
                />
              )}
              {/* hover wash for the inactive rows — sits under the pill */}
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl bg-ivory/0 transition-colors duration-300 group-hover:bg-ivory/[0.06]"
              />

              <span className="relative z-10 grid h-6 w-6 shrink-0 place-items-center">
                <Icon
                  className={`h-[19px] w-[19px] transition-transform duration-500 ease-out-expo ${
                    active ? "text-champagne" : "group-hover:scale-110"
                  }`}
                />
              </span>

              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: reduced ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 min-w-0 flex-1"
                  >
                    <span className="block truncate text-[13px] font-medium tracking-[0.02em]">
                      {item.label}
                    </span>
                    <span
                      className={`block truncate text-[10.5px] tracking-[0.06em] transition-colors duration-300 ${
                        active ? "text-champagne/80" : "text-ivory/50"
                      }`}
                    >
                      {item.hint}
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            className="border-t border-ivory/10 px-7 py-6"
          >
            <p className="font-playfair text-[15px] italic text-champagne/90">Il piacere del vino</p>
            <p className="mt-1 text-[10.5px] tracking-[0.08em] text-ivory/40">
              Maria&nbsp;Maria — Redaktionssystem
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
