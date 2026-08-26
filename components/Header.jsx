"use client";
import { useEffect, useRef, useState } from "react";
import Link from "@/components/i18n/LocaleLink";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring, useMotionValueEvent } from "motion/react";
import Logo from "./Logo";
import Button from "./ui/Button";
import WineMenu from "./WineMenu";
import LanguageSwitcher from "./i18n/LanguageSwitcher";
import { useCommon } from "@/lib/i18n/context";
import { pathWithoutLocale } from "@/lib/i18n/routing";
import { useLenis } from "./motion/SmoothScroll";
import { Close, Menu, Grapes } from "./Icons";
import { topsellerHref } from "@/lib/shop/config";
import useMediaQuery from "@/components/motion/useMediaQuery";

/* Pfad und Wörterbuch-Schlüssel gehören zusammen, die Beschriftung nicht:
   Routen sind in allen vier Sprachen identisch (/unsere-weine bleibt
   /unsere-weine, nur mit Präfix), der Text darüber wechselt. */
const NAV = [
  { key: "home", href: "/" },
  { key: "wines", href: "/unsere-weine" },
  { key: "regions", href: "/regionen" },
  { key: "magazine", href: "/magazin" },
  { key: "contact", href: "/kontakt" },
];

const WINE_ARTEN = [
  { key: "red", art: "rot" },
  { key: "white", art: "weiss" },
  { key: "rose", art: "rose" },
];

export default function Header() {
  const nav = useCommon("nav");
  const a11y = useCommon("a11y");
  const pathname = usePathname();
  const lenisRef = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const overlayRef = useRef(null);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  /* Der Zustandswechsel hängt an Motions scrollY statt an einem eigenen
     scroll-Listener. Ein zweiter Listener würde `window.scrollY` außerhalb
     des Frame-Loops lesen — also mitten im Scrollen einen Layout-Read
     erzwingen, während Lenis im selben Frame schreibt. Motion misst den
     Scroll ohnehin schon einmal pro Frame im `read`-Step; wir hängen uns
     dort an, statt ein zweites Mal zu messen. */
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 28));

  /* Einstiegszustand: bei Back-Navigation stellt der Browser die
     Scroll-Position wieder her, bevor irgendein "change" feuert. */
  useEffect(() => setScrolled(scrollY.get() > 28), [scrollY]);

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

  /* Vergleich auf dem sprachfreien Pfad: Auf /it/kontakt steht in `pathname`
     das Präfix mit, in `href` nicht — ohne das Abschneiden wäre außerhalb des
     Deutschen nie ein Navigationspunkt markiert. */
  const here = pathWithoutLocale(pathname || "/");
  const isActive = (href) => (href === "/" ? here === "/" : here.startsWith(href));

  /* Weiße Kopfzeile nur auf der Regionen-Seite: Dort liegt die Leiste ohne
     hellen Schleier direkt auf dem dunklen Weinberg-Video, Anthrazit und
     Bordeaux gehen darin unter. Sobald die Glas-Pille beim Scrollen
     erscheint (heller Grund), fällt die Leiste auf die normalen Farben
     zurück. Alle anderen Seiten bleiben unberührt. */
  const onDark = here.startsWith("/regionen") && !scrolled;

  /* Ab lg steht die Linkleiste, darunter der Menü-Knopf. Server-Snapshot
     `true`: Das gerenderte HTML zeigt die Desktop-Fassung, schmale Geräte
     korrigieren sich unmittelbar nach der Hydration. */
  const wideNav = useMediaQuery("(min-width: 1024px)", true);

  /* Beim Wechsel ins Desktop-Layout das Menü schließen. Ab lg blendet CSS
     das Overlay aus, `open` bliebe aber true — und mit ihm die Scroll-Sperre
     auf <html> und die Tastaturfalle, beide an einem Dialog hängend, den
     niemand mehr sieht. Ein iPad, das aus dem Hoch- ins Querformat dreht,
     überquert genau diese Grenze. */
  useEffect(() => {
    if (wideNav) setOpen(false);
  }, [wideNav]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
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
          {/* shrink-0: Die Wortmarke ist keine Verhandlungsmasse. Ohne die
              Angabe ist der Logo-Link das erste Flex-Kind, das nachgibt,
              sobald die Zeile zu voll wird — das Bild trug seine 96 px in der
              Klasse und wurde trotzdem auf 39 px gequetscht. Reißt die Zeile
              künftig doch wieder, soll sie sichtbar reißen und nicht heimlich
              am Logo sparen. */}
          <Link href="/" aria-label={a11y.homeLink} className="block shrink-0">
            <Logo className={`h-auto transition-all duration-500 ease-out-expo ${scrolled ? "w-[76px]" : "w-[96px]"}`} />
          </Link>

          {/* Die Linkleiste steht erst ab lg, nicht schon ab md.

              Zwischen 768 und 1023 px passte sie nie: Logo (96), fünf Links
              (379 auf Deutsch), Sprachwahl (64) und Shop-Pille (212) wollen
              rund 762 px, das Inhaltsfeld eines iPads hochkant bietet 705.
              Die Flex-Zeile hat die Differenz still am Logo abgezogen — die
              Wortmarke stand dort 39 px breit, auf Tschechisch 7 px.

              Voriger Stand war, an den Beschriftungen zu sparen (kurze
              Fassungen für Shop und Regionen). Das verschob die Grenze um
              wenige Pixel und band jede künftige Textänderung an die Breite
              der Kopfzeile. In diesem Band trägt jetzt der Menü-Knopf die
              Navigation — dieselbe Lösung wie auf dem Telefon, dessen
              Overlay die fünf Ziele ohnehin schon in voller Länge zeigt.

              gap-6 bis xl: Direkt an der Grenze — 1024 px, iPad Pro quer —
              füllen Logo, Leiste, Sprachwahl und Pille das Inhaltsfeld auf
              Italienisch exakt aus, ohne ein Pixel Rest. Die Beschriftungen
              sind seit „Regioni del vino" länger geworden; der engere
              Abstand gibt in diesem Band die 32 px zurück, die das auffängt.
              Ab xl steht wieder der ursprüngliche Abstand. Bewusst am
              Abstand gespart und nicht am Seitenrand: Der Rand hält die
              Kopfzeile bündig mit dem Inhalt darunter. */}
          <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label={a11y.mainNav}>
            {NAV.map((item) => {
              const active = isActive(item.href);
              if (item.href === "/unsere-weine")
                return <WineMenu key={item.href} active={active} scrolled={scrolled} onDark={onDark} />;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative lg:whitespace-nowrap py-2 text-[12.5px] tracking-[0.08em] transition-colors duration-300 ${
                    onDark
                      ? active
                        ? "font-semibold text-white"
                        : "text-white/80 hover:text-white"
                      : active
                        ? "font-semibold text-bordeaux"
                        : "text-charcoal/75 hover:text-bordeaux"
                  }`}
                >
                  {nav[item.key]}
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
            {/* Sprachwahl links vom Shop-Button: Sie ist ein Werkzeug, keine
                Handlungsaufforderung, und darf der primären CTA nicht die
                Aufmerksamkeit nehmen. */}
            <div className="hidden md:block">
              <LanguageSwitcher onDark={onDark} />
            </div>
            <div className="hidden md:block">
              {/* Nicht die Sammelseite, sondern die Topseller: der Knopf steht
                  auf jeder Seite und trifft niemanden, der schon eine Flasche
                  gewählt hat — siehe lib/shop/config. */}
              <Button href={topsellerHref()} size="sm" className="whitespace-nowrap">
                {nav.shop}
              </Button>
            </div>
            {/* Auf Telefonen steht die Sprachwahl NEBEN dem Menü-Knopf, nicht
                darin: Wer die Seite in der falschen Sprache öffnet, soll sie
                wechseln können, ohne erst ein Menü zu suchen. Im Menü bleibt
                die Reihe zusätzlich stehen — dort für alle, die schon drin sind. */}
            <div className="md:hidden">
              <LanguageSwitcher onDark={onDark} />
            </div>
            <button
              ref={triggerRef}
              onClick={() => setOpen(true)}
              aria-label={a11y.openMenu}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors lg:hidden ${
                onDark
                  ? "border-white/30 text-white hover:border-champagne hover:text-champagne-light"
                  : "border-charcoal/15 text-charcoal hover:border-champagne hover:text-bordeaux"
              }`}
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
            aria-label={a11y.menuDialog}
            data-lenis-prevent
            className="grain fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain bg-gradient-to-b from-bordeaux-deep via-[#33080e] to-espresso pt-[env(safe-area-inset-top)] lg:hidden"
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
                aria-label={a11y.closeMenu}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors hover:border-champagne hover:text-champagne"
              >
                <Close className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-1 px-8" aria-label={a11y.mobileNav}>
              {[...NAV, { key: "shop", href: topsellerHref() }].map((item, i) => (
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
                    {nav[item.key]}
                  </Link>
                  {item.href === "/unsere-weine" && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {WINE_ARTEN.map((a) => (
                        <Link
                          key={a.art}
                          href={`/unsere-weine?art=${a.art}#kollektion`}
                          className="rounded-full border border-ivory/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory/70 transition-colors hover:border-champagne hover:text-champagne"
                        >
                          {nav.wineTypes[a.key]}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </nav>
            <motion.div
              className="px-8 pb-[calc(2.5rem+env(safe-area-inset-bottom))]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              {/* Flache Reihe statt Aufklapp-Panel: Im mobilen Overlay wäre
                  ein zweites Overlay darüber nur eine Falle. */}
              <LanguageSwitcher variant="inline" className="mb-6" />
              <p className="text-[12px] tracking-wide text-ivory/60">info@maria-maria.de</p>
              <p className="mt-1 font-playfair text-[15px] italic text-champagne/90">Il piacere del vino</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
