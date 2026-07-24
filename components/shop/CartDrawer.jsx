"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "motion/react";
import Bottle from "@/components/Bottle";
import Button from "@/components/ui/Button";
import { useLenis } from "@/components/motion/SmoothScroll";
import useMediaQuery from "@/components/motion/useMediaQuery";
import { IconChip } from "@/components/Deco";
import { Cart, Close, Check, Plus, Grapes } from "@/components/Icons";
import { Minus, Shield } from "./ShopIcons";
import { fmtPrice } from "@/components/data";
import { useCart } from "./CartContext";
import { PRODUCTS } from "./shopData";

/* Warenkorb — on desktop a spring slide-over from the right; on phones a
   bottom sheet with a grab handle that can be flicked shut. A floating glass
   pill follows the visitor while the cart is filled. Focus is trapped while
   open, Escape closes, Lenis pauses underneath. */

const SPRING = { type: "spring", stiffness: 300, damping: 32 };

function ItemRow({ item }) {
  const { add, decrement, remove } = useCart();
  const product = PRODUCTS[item.id];
  if (!product) return null;

  return (
    <div className="flex items-center gap-4 py-4">
      {/* mini stage */}
      <div className="relative flex h-20 w-16 shrink-0 items-end justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-white to-cream ring-1 ring-stone/50">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(200,183,122,0.3), transparent 72%)" }}
        />
        <div className="relative flex items-end pb-2">
          {product.variants.slice(0, 3).map((v, i) => (
            <Bottle
              key={`${v}${i}`}
              variant={v}
              className={`h-14 ${i > 0 ? "-ml-3" : ""} ${product.variants.length > 1 ? (i === 0 ? "-rotate-6" : i === 2 ? "rotate-6" : "") : ""
                }`}
            />
          ))}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-playfair text-[14.5px] leading-snug text-charcoal">{product.name}</p>
        <p className="mt-0.5 text-[10.5px] uppercase tracking-[0.12em] text-charcoal/55">{product.sub}</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-full border border-stone/70 bg-white/70 p-0.5">
            <button
              type="button"
              onClick={() => decrement(item.id)}
              aria-label={`Menge von ${product.name} verringern`}
              className="flex h-7 w-7 items-center justify-center rounded-full text-charcoal/70 transition-colors hover:bg-champagne-light/50 hover:text-bordeaux"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-[12px] font-semibold tabular-nums text-charcoal">{item.qty}</span>
            <button
              type="button"
              onClick={() => add(item.id)}
              aria-label={`Menge von ${product.name} erhöhen`}
              className="flex h-7 w-7 items-center justify-center rounded-full text-charcoal/70 transition-colors hover:bg-champagne-light/50 hover:text-bordeaux"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-[13.5px] font-semibold tabular-nums text-charcoal">
            {fmtPrice(product.price * item.qty)}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => remove(item.id)}
        aria-label={`${product.name} aus dem Warenkorb entfernen`}
        className="flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-full text-charcoal/40 transition-colors hover:bg-bordeaux/10 hover:text-bordeaux"
      >
        <Close className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function CartDrawer() {
  const reduced = useReducedMotion();
  const lenisRef = useLenis();
  /* below sm the drawer becomes a bottom sheet — the natural cart shape
     for one-handed use on a phone */
  const isSheet = useMediaQuery("(max-width: 639px)");
  const dragControls = useDragControls();
  const {
    items,
    count,
    subtotal,
    shipping,
    total,
    freeShippingFrom,
    missingForFreeShipping,
    clear,
    open,
    openCart,
    closeCart,
  } = useCart();

  const [order, setOrder] = useState(null); // order number after checkout
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  /* pause smooth scroll + lock the page while the drawer is open */
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

  /* focus in, trap Tab, Escape closes */
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        closeCart();
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
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeCart]);

  const checkout = () => {
    setOrder(`MM-${Date.now().toString(36).toUpperCase().slice(-6)}`);
  };
  const finish = () => {
    clear();
    setOrder(null);
    closeCart();
  };

  const progress = Math.min(1, subtotal / freeShippingFrom);

  return (
    <>
      {/* ---------- floating cart pill ---------- */}
      <AnimatePresence>
        {count > 0 && !open && (
          <motion.div
            initial={reduced ? false : { y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="pointer-events-none fixed inset-x-0 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-40 flex justify-center px-4"
          >
            <div className="inline-block">
              <button
                type="button"
                onClick={openCart}
                aria-label={`Warenkorb öffnen — ${count} Artikel, ${fmtPrice(subtotal)}`}
                className="glass group pointer-events-auto flex h-14 items-center gap-4 rounded-full pl-5 pr-6 shadow-lift transition-shadow duration-300"
              >
                <span className="relative text-charcoal">
                  <Cart className="h-5 w-5" />
                  <motion.span
                    key={count}
                    initial={reduced ? false : { scale: 0.4 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="absolute -right-2.5 -top-2.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-bordeaux px-1 text-[10px] font-semibold tabular-nums text-ivory shadow-chip"
                  >
                    {count}
                  </motion.span>
                </span>
                <span aria-hidden="true" className="h-5 w-px bg-charcoal/15" />
                <span className="text-[14px] font-semibold tabular-nums text-charcoal">{fmtPrice(subtotal)}</span>
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/60 transition-colors duration-300 group-hover:text-bordeaux">
                  Warenkorb
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- drawer ---------- */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              aria-hidden="true"
              onClick={closeCart}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[70] bg-espresso/45 backdrop-blur-[2px]"
            />
            <motion.aside
              key="panel"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Warenkorb"
              data-lenis-prevent
              initial={reduced ? { opacity: 0 } : isSheet ? { y: "104%" } : { x: "104%" }}
              animate={reduced ? { opacity: 1 } : isSheet ? { y: 0 } : { x: 0 }}
              exit={reduced ? { opacity: 0 } : isSheet ? { y: "104%" } : { x: "104%" }}
              transition={SPRING}
              drag={isSheet && !reduced ? "y" : false}
              dragListener={false}
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.55 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 90 || info.velocity.y > 600) closeCart();
              }}
              className="fixed inset-x-0 bottom-0 z-[75] flex max-h-[86svh] w-full flex-col rounded-t-[2rem] bg-ivory shadow-lift will-transform sm:inset-x-auto sm:inset-y-0 sm:right-0 sm:max-h-none sm:max-w-[430px] sm:rounded-t-none sm:rounded-l-card-lg"
            >
              {/* grab handle — drag or flick the sheet shut (phones only) */}
              <div
                className="flex shrink-0 cursor-grab justify-center pb-1 pt-3 active:cursor-grabbing sm:hidden"
                style={{ touchAction: "none" }}
                onPointerDown={(e) => {
                  if (isSheet && !reduced) dragControls.start(e);
                }}
              >
                <span aria-hidden="true" className="h-1.5 w-12 rounded-full bg-charcoal/15" />
              </div>

              {/* head */}
              <div className="flex items-center justify-between border-b border-stone/50 px-6 py-3.5 sm:py-5">
                <p className="font-playfair text-[21px] text-charcoal">
                  Ihr Warenkorb
                  {count > 0 && (
                    <span className="ml-2 align-middle font-montserrat text-[11px] uppercase tracking-[0.16em] text-charcoal/50">
                      {count} {count === 1 ? "Artikel" : "Artikel"}
                    </span>
                  )}
                </p>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={closeCart}
                  aria-label="Warenkorb schließen"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 text-charcoal transition-colors hover:border-champagne hover:text-bordeaux"
                >
                  <Close className="h-5 w-5" />
                </button>
              </div>

              {order ? (
                /* ---------- checkout success ---------- */
                <div className="flex flex-1 flex-col items-center justify-center px-8 pb-[calc(3rem+env(safe-area-inset-bottom))] pt-10 text-center sm:py-0">
                  <motion.div
                    initial={reduced ? false : { scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  >
                    <IconChip size="lg">
                      <Check className="h-7 w-7" />
                    </IconChip>
                  </motion.div>
                  <h3 className="mt-6 font-playfair text-[26px] text-charcoal">
                    Grazie <span className="italic text-bordeaux">mille!</span>
                  </h3>
                  <p className="mt-3 max-w-[280px] text-[13px] leading-relaxed text-charcoal/70">
                    Vielen Dank für Ihre Bestellung. Eine Bestätigung ist unterwegs in Ihr Postfach.
                  </p>
                  <p className="mt-5 rounded-full border border-stone/60 bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-charcoal/60">
                    Bestellnummer <span className="font-semibold text-bordeaux">{order}</span>
                  </p>
                  <div className="mt-8">
                    <Button onClick={finish} variant="outline" magnetic={false}>
                      Weiter stöbern
                    </Button>
                  </div>
                </div>
              ) : count === 0 ? (
                /* ---------- empty state ---------- */
                <div className="flex flex-1 flex-col items-center justify-center px-8 pb-[calc(3rem+env(safe-area-inset-bottom))] pt-10 text-center sm:py-0">
                  <Grapes className="h-10 w-10 text-champagne" />
                  <h3 className="mt-5 font-playfair text-[22px] text-charcoal">
                    Noch ganz <span className="italic text-bordeaux">leer.</span>
                  </h3>
                  <p className="mt-3 max-w-[280px] text-[13px] leading-relaxed text-charcoal/70">
                    Entdecken Sie unsere Boutique-Weine und Probierpakete – Ihr Maria-Moment wartet schon.
                  </p>
                  <div className="mt-8">
                    <Button onClick={closeCart} magnetic={false}>
                      Weine entdecken
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* free-shipping progress */}
                  <div className="border-b border-stone/50 px-6 py-4">
                    <p aria-live="polite" className="text-[12px] text-charcoal/75">
                      {missingForFreeShipping > 0 ? (
                        <>
                          Noch <span className="font-semibold tabular-nums text-bordeaux">{fmtPrice(missingForFreeShipping)}</span> bis
                          zum <span className="font-semibold">kostenfreien Versand</span>
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-bordeaux">
                          <Check className="h-4 w-4" /> Ihre Bestellung ist versandkostenfrei
                        </span>
                      )}
                    </p>
                    <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-stone/50">
                      <motion.div
                        aria-hidden="true"
                        className="h-full w-full origin-left rounded-full bg-gradient-to-r from-champagne to-bordeaux will-transform"
                        initial={false}
                        animate={{ scaleX: progress }}
                        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 22 }}
                      />
                    </div>
                  </div>

                  {/* items */}
                  <div data-lenis-prevent className="flex-1 divide-y divide-stone/40 overflow-y-auto overscroll-contain px-6">
                    <AnimatePresence initial={false} mode="popLayout">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout={!reduced}
                          initial={reduced ? false : { opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduced ? { opacity: 0 } : { opacity: 0, x: 60 }}
                          transition={SPRING}
                        >
                          <ItemRow item={item} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* summary */}
                  <div className="border-t border-stone/50 bg-cream/80 px-6 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 sm:pb-6">
                    <dl className="space-y-1.5 text-[12.5px] text-charcoal/75">
                      <div className="flex items-center justify-between">
                        <dt>Zwischensumme</dt>
                        <dd className="tabular-nums">{fmtPrice(subtotal)}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt>Versand</dt>
                        <dd className="tabular-nums">{shipping === 0 ? "Kostenfrei" : fmtPrice(shipping)}</dd>
                      </div>
                      <div className="flex items-baseline justify-between border-t border-dashed border-stone/60 pt-3 text-charcoal">
                        <dt className="text-[13px] font-semibold">
                          Gesamt <span className="font-normal text-charcoal/50">inkl. MwSt.</span>
                        </dt>
                        <dd className="font-playfair text-[24px] tabular-nums text-bordeaux">{fmtPrice(total)}</dd>
                      </div>
                    </dl>
                    <div className="mt-5">
                      <Button onClick={checkout} size="lg" className="w-full" magnetic={false}>
                        Zur Kasse
                      </Button>
                    </div>
                    <p className="mt-3.5 flex items-center justify-center gap-1.5 text-[10.5px] uppercase tracking-[0.14em] text-charcoal/50">
                      <Shield className="h-4 w-4 text-champagne" /> Sichere Bezahlung · SSL-verschlüsselt
                    </p>
                  </div>
                </>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
