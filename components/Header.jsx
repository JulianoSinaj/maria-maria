"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import Logo from "./Logo";
import Button from "./ui/Button";
import WineMenu from "./WineMenu";
import { useLenis } from "./motion/SmoothScroll";
import { Close, Menu, Grapes } from "./Icons";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Unsere Weine", href: "/weine" },
  { label: "Regionen", href: "/regionen" },
  { label: "Magazin", href: "/magazin" },
  { label: "Kontakt", href: "/kontakt" },
];

const WINE_ARTEN = [
  { label: "Rotweine", art: "rot" },
  { label: "Weißweine", art: "weiss" },
  { label: "Roséweine", art: "rose" },
];

export default function Header() {
  const pathname = usePathname();
  const lenisRef = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const overlayRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = lenisRef?.current;
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [open, lenisRef]);

  useEffect(() => setOpen(false), [pathname]);

  // menu focus management: move focus in, trap Tab, close on Escape, restore on close
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const els = overlayRef.current?.querySelectorAll("a[href], button:not([disabled])");
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
      triggerRef.current?.focus();
    };
  }, [open]);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* reading progress */}
      <motion.div
        aria-hidden="true"
        className="h-[2px] origin-left bg-gradient-to-r from-champagne via-bordeaux to-champagne"
        style={{ scaleX: progress }}
      />

      <div className={`transition-all duration-500 ease-out-expo ${scrolled ? "px-3 pt-3 lg:px-6" : ""}`}>
        <div
          className={`mx-auto flex items-center justify-between transition-all duration-500 ease-out-expo ${scrolled
              ? "glass h-16 max-w-[1060px] rounded-full px-4 shadow-glass sm:px-6"
              : "h-20 max-w-content bg-transparent px-6 lg:h-24 lg:px-10"
            }`}
        >
          <Link href="/" aria-label="Maria Maria — Startseite" className="block">
            <Logo className={`h-auto transition-all duration-500 ease-out-expo ${scrolled ? "w-[76px]" : "w-[96px]"}`} />
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Hauptnavigation">
            {NAV.map((item) => {
              const active = isActive(item.href);
              if (item.href === "/weine") return <WineMenu key={item.href} active={active} />;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative py-2 text-[12.5px] tracking-[0.08em] transition-colors duration-300 ${active ? "font-semibold text-bordeaux" : "text-charcoal/75 hover:text-bordeaux"
                    }`}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-champagne to-bordeaux"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  ) : (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] origin-left scale-x-0 rounded-full bg-champagne/70 transition-transform duration-400 ease-out-expo group-hover:scale-x-100" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <Button href="/shop" size="sm">
                Zum Shop
              </Button>
            </div>
            <button
              ref={triggerRef}
              onClick={() => setOpen(true)}
              aria-label="Menü öffnen"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/15 text-charcoal transition-colors hover:border-champagne hover:text-bordeaux md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* -------- mobile menu -------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={overlayRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menü"
            data-lenis-prevent
            className="grain fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain bg-gradient-to-b from-bordeaux-deep via-[#33080e] to-espresso md:hidden"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex h-20 items-center justify-between px-6">
              <Grapes className="h-7 w-7 text-champagne" />
              <button
                ref={closeRef}
                onClick={() => setOpen(false)}
                aria-label="Menü schließen"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors hover:border-champagne hover:text-champagne"
              >
                <Close className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-1 px-8" aria-label="Mobile Navigation">
              {[...NAV, { label: "Zum Shop", href: "/shop" }].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.12 + i * 0.06 }}
                >
                  <Link
                    href={item.href}
                    className={`block py-3 font-playfair text-[2.1rem] leading-tight transition-colors ${isActive(item.href) ? "italic text-champagne" : "text-ivory hover:text-champagne"
                      }`}
                  >
                    {item.label}
                  </Link>
                  {item.href === "/weine" && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {WINE_ARTEN.map((a) => (
                        <Link
                          key={a.art}
                          href={`/weine?art=${a.art}#kollektion`}
                          className="rounded-full border border-ivory/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory/70 transition-colors hover:border-champagne hover:text-champagne"
                        >
                          {a.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </nav>
            <motion.div
              className="px-8 pb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <p className="text-[12px] tracking-wide text-ivory/60">info@maria-maria.wine</p>
              <p className="mt-1 font-playfair text-[15px] italic text-champagne/90">Il piacere del vino</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
