"use client";
import Link from "@/components/i18n/LocaleLink";
import { motion } from "motion/react";
import { Arrow, ArrowUpRight } from "../Icons";

/* Maria Maria button system — premium micro-interactions.
   
   VARIANTS:
   - primary: Deep wine gradient (default, prominent CTAs)
   - dark: Charcoal with bordeaux fill
   - outline: Bordeaux outline on a champagne pane (secondary CTAs on photos)
   - glass: Frosted glass effect with transparent shine
   - light: Soft champagne gradient (neutral, secondary actions)
   - premium: Gold/champagne gradient (luxury, elegant feel)
   - accent: Teal/acqua gradient (attention, complementary)
   - vibrant: Deep wine gradient with layered depths (bold CTAs)
   - mint: Light aqua gradient (fresh, friendly tone)
   - earth: Forest green to dark brown (natural, grounded feel)
   
   ANIMATIONS: Layered micro-interactions with zero layout shift:
   - Rising fill from bottom on hover
   - Shimmer sweep across surface
   - Subtle glow effect on hover
   - Masked label roll-up animation
   - Icon directional movement
   - Spring-based press compression (scale)
   
   All layers use transform/opacity only — zero layout shift. */

const MotionLink = motion.create(Link);

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
  /* Sekundär-CTA, aber nicht farblos: Bordeaux-Rand und -Schrift auf einer
     champagnerfarbenen Scheibe. Über den Hero-Fotos stand die Pille vorher
     als graue Kontur im Bild — mit Frost und Weinfarbe trägt sie den Ton der
     Marke, ohne dem primären Button den Rang abzulaufen. */
  outline: {
    base: "border border-bordeaux/40 bg-gradient-to-br from-ivory/85 to-champagne-light/55 text-bordeaux shadow-chip backdrop-blur-[6px]",
    fill: "bg-gradient-to-br from-bordeaux to-wine",
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
    base: "bg-gradient-to-br from-champagne-light to-ivory text-charcoal shadow-glass",
    fill: "bg-champagne",
    labelIn: "text-charcoal",
    iconHover: "",
  },
  premium: {
    base: "bg-gradient-to-br from-champagne via-champagne-light to-straw text-charcoal shadow-chip hover:shadow-md transition-shadow",
    fill: "bg-champagne-deep",
    labelIn: "text-charcoal",
    iconHover: "",
  },
  accent: {
    base: "bg-gradient-to-br from-acqua to-acqua-deep text-cream shadow-chip",
    fill: "bg-acqua-deep",
    labelIn: "text-cream",
    iconHover: "",
  },
  vibrant: {
    base: "bg-gradient-to-br from-wine via-bordeaux to-bordeaux-deep text-ivory shadow-chip",
    fill: "bg-bordeaux-deep",
    labelIn: "text-ivory",
    iconHover: "",
  },
  mint: {
    base: "bg-gradient-to-br from-acqua-light to-acqua text-charcoal shadow-glass",
    fill: "bg-acqua-deep",
    labelIn: "text-cream",
    iconHover: "",
  },
  earth: {
    base: "bg-gradient-to-br from-vine to-espresso text-ivory shadow-chip",
    fill: "bg-espresso",
    labelIn: "text-ivory",
    iconHover: "",
  },
};

/* min-h statt h: eine feste Höhe schneidet jedes Label ab, das in einer
   schmalen Spalte umbricht — der Text lief dann sichtbar unten aus der Pille
   heraus (aufgefallen an „Diesen Wein im offiziellen Shop entdecken" in der
   Pairing-Sektion, 89 px Inhalt in 44 px Pille). Mit min-h + py bleibt die
   einzeilige Pille exakt so hoch wie vorher und wächst nur im Umbruchfall. */
const SIZES = {
  sm: "min-h-[40px] px-5 py-2.5 text-[12px]",
  md: "min-h-[44px] px-6 py-3 text-[12.5px]",
  lg: "min-h-[52px] px-8 py-3.5 text-[13.5px]",
};

export default function Button({
  href,
  external = false,
  variant = "primary",
  size = "md",
  icon = true,
  iconType = "arrow", // "arrow" | "up-right" | "none"
  /* akzeptiert, aber ohne Wirkung — die Magnet-Bewegung ist entfernt */
  magnetic = true, // eslint-disable-line no-unused-vars
  className = "",
  children,
  ...rest
}) {
  const cfg = VARIANTS[variant] || VARIANTS.primary;
  const Icon = iconType === "up-right" ? ArrowUpRight : Arrow;

  const cls = [
    "group relative inline-flex select-none items-center justify-center gap-2.5 overflow-hidden rounded-full",
    "font-medium uppercase tracking-[0.14em] transition-shadow duration-300",
    SIZES[size] || SIZES.md,
    cfg.base,
    className,
  ].join(" ");

  const content = (
    <>
      {/* rising fill with enhanced animation */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 z-0 translate-y-[103%] rounded-[46%_46%_0_0] transition-[transform,border-radius] duration-500 ease-out-expo group-hover:translate-y-0 group-hover:rounded-none ${cfg.fill}`}
      />
      
      {/* enhanced shine sweep with color adaptation */}
      <span aria-hidden="true" className="absolute inset-0 z-[1] overflow-hidden rounded-full">
        <span className="absolute top-0 h-full w-1/3 -translate-x-[260%] -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-[900ms] ease-out-expo group-hover:translate-x-[360%]" />
      </span>
      
      {/* subtle glow effect on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
        }}
      />
      
      {/* masked label roll with enhanced motion */}
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
    whileTap: { scale: 0.96 },
    transition: { type: "spring", stiffness: 400, damping: 22 },
    className: cls,
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
