"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Cart, Plus } from "@/components/Icons";
import { Minus } from "./ShopIcons";
import { useCart } from "./CartContext";
import { wineId } from "./shopData";

/* Add-to-cart control — a circular cart button that morphs into a quantity
   stepper. Lives in a fixed-size slot, so the morph never shifts layout.
   Sits on z-10, above a card's stretched detail link. */

const SPRING = { type: "spring", stiffness: 320, damping: 24 };

export default function AddToCart({ wine, className = "" }) {
  const reduced = useReducedMotion();
  const { add, decrement, qtyOf } = useCart();
  const id = wineId(wine);
  const qty = qtyOf(id);

  return (
    <div className={`relative z-10 h-11 w-[118px] shrink-0 ${className}`}>
      <AnimatePresence initial={false}>
        {qty === 0 ? (
          <motion.button
            key="add"
            type="button"
            onClick={() => add(id)}
            aria-label={`${wine.name} in den Warenkorb legen`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={SPRING}
            whileTap={{ scale: 0.9 }}
            className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-full bg-bordeaux text-ivory shadow-chip transition-colors duration-300 hover:bg-bordeaux-deep"
          >
            <Cart className="h-[18px] w-[18px]" />
          </motion.button>
        ) : (
          <motion.div
            key="stepper"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={SPRING}
            className="absolute inset-0 flex items-center justify-between rounded-full bg-bordeaux px-1 text-ivory shadow-chip"
          >
            <motion.button
              type="button"
              onClick={() => decrement(id)}
              aria-label={`Eine Flasche ${wine.name} entfernen`}
              whileTap={{ scale: 0.85 }}
              transition={SPRING}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 hover:bg-white/10"
            >
              <Minus className="h-4 w-4" />
            </motion.button>
            <motion.span
              key={qty}
              initial={reduced ? false : { y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={SPRING}
              aria-live="polite"
              className="text-[13px] font-semibold tabular-nums"
            >
              {qty}
            </motion.span>
            <motion.button
              type="button"
              onClick={() => add(id)}
              aria-label={`Eine weitere Flasche ${wine.name} hinzufügen`}
              whileTap={{ scale: 0.85 }}
              transition={SPRING}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 hover:bg-white/10"
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
