"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Close } from "@/components/Icons";
import { ADMIN_SECTIONS } from "./nav";
import { ICONS } from "./AdminIcons";

/* Mobile/tablet drawer. Mirrors the storefront menu's conventions: focus moves
   in on open, Tab is trapped, Escape closes, focus returns to the trigger. */

export default function AdminMobileNav({ open, onClose, isActive, triggerRef }) {
  const reduced = useReducedMotion();
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const els = panelRef.current?.querySelectorAll("a[href], button:not([disabled])");
      if (!els?.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      triggerRef?.current?.focus();
    };
  }, [open, onClose, triggerRef]);

  // the admin shell scrolls its own main column, but lock the page too so
  // iOS doesn't rubber-band the drawer
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <motion.button
            type="button"
            aria-label="Navigation schließen"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
            className="absolute inset-0 w-full cursor-default bg-espresso/60 backdrop-blur-sm"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Admin-Navigation"
            data-lenis-prevent
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={
              reduced
                ? { duration: 0 }
                : { type: "spring", stiffness: 260, damping: 32, mass: 0.9 }
            }
            className="grain absolute inset-y-0 left-0 flex w-[86%] max-w-[330px] flex-col overflow-y-auto overscroll-contain bg-gradient-to-b from-espresso via-[#2a1a15] to-bordeaux-deep pt-[env(safe-area-inset-top)] will-transform"
          >
            <div className="flex h-20 items-center justify-between px-6">
              <span className="font-playfair text-[19px] italic text-champagne">Maria Maria</span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Navigation schließen"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors hover:border-champagne hover:text-champagne"
              >
                <Close className="h-5 w-5" />
              </button>
            </div>

            <nav aria-label="Admin-Navigation mobil" className="flex flex-1 flex-col gap-1.5 px-4 py-4">
              {ADMIN_SECTIONS.map((item, i) => {
                const Icon = ICONS[item.icon];
                const active = isActive(item);
                return (
                  <motion.div
                    key={item.href}
                    initial={reduced ? false : { opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 24,
                      delay: reduced ? 0 : 0.08 + i * 0.05,
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3.5 rounded-2xl border px-4 py-3.5 transition-colors duration-300 ${
                        active
                          ? "border-champagne/30 bg-champagne/15 text-ivory"
                          : "border-transparent text-ivory/70 hover:bg-ivory/[0.06] hover:text-ivory"
                      }`}
                    >
                      <Icon
                        className={`h-[19px] w-[19px] shrink-0 ${active ? "text-champagne" : ""}`}
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-[13.5px] font-medium">{item.label}</span>
                        <span
                          className={`block truncate text-[10.5px] tracking-[0.06em] ${
                            active ? "text-champagne/80" : "text-ivory/50"
                          }`}
                        >
                          {item.hint}
                        </span>
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="border-t border-ivory/10 px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-5">
              <Link
                href="/"
                className="text-[11.5px] tracking-[0.08em] text-ivory/50 transition-colors hover:text-champagne"
              >
                ← Zur Website
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
