"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useMagneticEnabled } from "../motion/MagneticContext";
import { Arrow, ArrowUpRight } from "../Icons";

/* Maria Maria button system.
   Layered micro-interactions: magnetic cursor tracking, a fill that rises
   inside the pill, a masked label roll, arrow travel, and press compression.
   All layers are transform/opacity only — zero layout shift.

   Magnetism lives on the button element itself (no wrapper div): a wrapper
   would break `w-full`-CTAs and flex layouts, while x/y on the element merges
   cleanly with the whileTap spring. Pointer-fine only, off under reduced
   motion. */

const MotionLink = motion.create(Link);

const MAGNET_SPRING = { stiffness: 180, damping: 16, mass: 0.4 };
const MAGNET_STRENGTH = 0.22;

const VARIANTS = {
  primary: {
    base: "bg-gradient-to-br from-bordeaux to-wine text-ivory shadow-chip",
    fill: "bg-bordeaux-deep",
    labelIn: "text-ivory",
    iconHover: "",
  },
  dark: {
    base: "bg-charcoal text-ivory",
    fill: "bg-bordeaux",
    labelIn: "text-ivory",
    iconHover: "",
  },
  outline: {
    base: "border border-charcoal/25 text-charcoal",
    fill: "bg-charcoal",
    labelIn: "text-ivory",
    iconHover: "group-hover:text-ivory",
  },
  glass: {
    base: "glass text-charcoal shadow-glass",
    fill: "bg-bordeaux",
    labelIn: "text-ivory",
    iconHover: "group-hover:text-ivory",
  },
  light: {
    base: "bg-ivory text-charcoal",
    fill: "bg-champagne-light",
    labelIn: "text-charcoal",
    iconHover: "",
  },
};

const SIZES = {
  sm: "h-10 px-5 text-[12px]",
  md: "h-11 px-6 text-[12.5px]",
  lg: "h-[52px] px-8 text-[13.5px]",
};

export default function Button({
  href,
  external = false,
  variant = "primary",
  size = "md",
  icon = true,
  iconType = "arrow", // "arrow" | "up-right" | "none"
  magnetic = true,
  className = "",
  children,
  ...rest
}) {
  const cfg = VARIANTS[variant] || VARIANTS.primary;
  const Icon = iconType === "up-right" ? ArrowUpRight : Arrow;

  const ref = useRef(null);
  const routeEnabled = useMagneticEnabled();
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, MAGNET_SPRING);
  const sy = useSpring(y, MAGNET_SPRING);
  const magneticOn = magnetic && routeEnabled && !reduced;

  const onPointerMove = (e) => {
    if (!magneticOn || e.pointerType === "touch") return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * MAGNET_STRENGTH);
    y.set((e.clientY - (r.top + r.height / 2)) * MAGNET_STRENGTH);
  };
  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  const cls = [
    "group relative inline-flex select-none items-center justify-center gap-2.5 overflow-hidden rounded-full",
    "font-medium uppercase tracking-[0.14em] transition-shadow duration-300",
    magneticOn ? "will-transform" : "",
    SIZES[size] || SIZES.md,
    cfg.base,
    className,
  ].join(" ");

  const content = (
    <>
      {/* rising fill */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 z-0 translate-y-[103%] rounded-[46%_46%_0_0] transition-[transform,border-radius] duration-500 ease-out-expo group-hover:translate-y-0 group-hover:rounded-none ${cfg.fill}`}
      />
      {/* shine sweep */}
      <span aria-hidden="true" className="absolute inset-0 z-[1] overflow-hidden rounded-full">
        <span className="absolute top-0 h-full w-1/3 -translate-x-[260%] -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[900ms] ease-out-expo group-hover:translate-x-[360%]" />
      </span>
      {/* masked label roll */}
      <span className="relative z-10 block overflow-hidden">
        <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-[115%]">
          {children}
        </span>
        <span
          aria-hidden="true"
          className={`absolute inset-0 block translate-y-[115%] transition-transform duration-500 ease-out-expo group-hover:translate-y-0 ${cfg.labelIn}`}
        >
          {children}
        </span>
      </span>
      {icon && iconType !== "none" && (
        <span className={`relative z-10 transition-colors duration-300 ${cfg.iconHover}`}>
          <Icon
            className={`h-4 w-4 transition-transform duration-500 ease-out-expo ${iconType === "up-right"
                ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                : "group-hover:translate-x-1"
              }`}
          />
        </span>
      )}
    </>
  );

  const motionProps = {
    ref,
    whileTap: { scale: 0.96 },
    transition: { type: "spring", stiffness: 400, damping: 22 },
    className: cls,
    ...(magneticOn && { style: { x: sx, y: sy }, onPointerMove, onPointerLeave }),
    ...rest,
  };

  if (href && external) {
    return (
      <motion.a href={href} target="_blank" rel="noopener noreferrer" {...motionProps}>
        {content}
      </motion.a>
    );
  }
  if (href) {
    return (
      <MotionLink href={href} {...motionProps}>
        {content}
      </MotionLink>
    );
  }
  return (
    <motion.button type={rest.type || "button"} {...motionProps}>
      {content}
    </motion.button>
  );
}
