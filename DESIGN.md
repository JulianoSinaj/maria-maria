# Maria Maria — Design & Architecture Blueprint

*"Il piacere del vino."* — How this site was designed and built.

This document explains the technology stack, the design principles, the design system (tokens, typography, color, motion) and the component architecture behind the Maria Maria website — an editorial-style showcase for Italian boutique wines, written in German for a German-speaking audience.

---

## 1. Technology Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | **Next.js 14** (App Router) | File-based routing, React Server Components, static prerendering — every route ships as static HTML (`○ Static`) with minimal JS |
| UI library | **React 18** | Component model; server components by default, `"use client"` only where interactivity is needed |
| Styling | **Tailwind CSS 3.4** + PostCSS/Autoprefixer | Utility-first styling with a custom design-token theme (see §3); no runtime CSS-in-JS cost |
| Animation | **Motion** (`motion/react`, the Framer Motion successor) | Physics-based springs, viewport-triggered reveals, layout-shift-free transforms |
| Smooth scrolling | **Lenis** | Inertial, weighted scroll feel; exposed via React context so overlays can pause it |
| Fonts | **`next/font/google`** — Playfair Display + Montserrat | Self-hosted at build time (zero layout shift, no external font requests), injected as CSS variables |
| Graphics | Hand-written **SVG** + a raw **WebGL** fragment shader | Bottle illustrations, Italy map, vine line-art, icons — all vector; hero/CTA backgrounds are a custom fbm-noise shader with no three.js dependency |
| Language | JavaScript (JSX) with `jsconfig.json` path alias `@/*` | Lightweight setup, no TS toolchain |
| Deployment | **Coolify** (Hetzner) via **Nixpacks** — `nixpacks.toml`, Node 20, port 3000 | `npm ci` → `next build` → `next start` |

No component library, no icon package, no CMS — every visual element is bespoke.

---

## 2. Design Principles

The site is designed like a **luxury print magazine that happens to move**. Five principles govern every decision:

### 2.1 Editorial luxury, not e-commerce
The layout borrows from editorial design: a serif display face for headlines (Playfair Display, often *italic* for the Italian phrases), generous whitespace, uppercase letter-spaced eyebrows (`tracking-[0.14em]`–`[0.22em]`), hairline rules, and a strict `1200px` content column (`max-w-content`). Products are presented as *characters with stories*, not SKUs — the shop itself is external; this site sells the *mood*.

### 2.2 A warm, wine-derived palette
Everything on screen is derived from the physical world of wine: bordeaux glass, champagne gold, ivory paper, espresso shadow. There is **no pure white and no pure black** anywhere — the page background is ivory `#F7F4EF`, text is charcoal `#1B1B1B`, and shadows are tinted warm (`rgba(43,20,14,…)`), never grey.

### 2.3 Atmosphere over flatness
No section sits on a flat background. Ambient layers create depth everywhere:
- **Auras** — huge, slowly drifting radial-gradient "aurora" blobs in champagne/blush/olive/bordeaux tints (36–44 s loops)
- **GhostWords** — giant italic serif words (*Momenti*, *Italia*, *Storie*) floating behind sections at 5 % opacity
- **Vines** — flowing SVG line-art of vine rows, a low sun and a grape cluster
- **Film grain** — an SVG `feTurbulence` noise overlay on hero/CTA bands
- **ShaderGradient** — a WebGL fbm-noise color field (palettes: `dawn`, `wine`, `vigna`) that flows slowly and reacts to scroll; falls back to a static CSS gradient without WebGL

All of this is `aria-hidden`, `pointer-events-none`, and GPU-friendly (transform/opacity only — no animated blur filters).

### 2.4 Weighted, physical motion
Motion follows one physics language across the whole site: a spring of `stiffness 90, damping 20` and the easing curve `cubic-bezier(0.16, 1, 0.3, 1)` (`ease-out-expo`). Elements don't "appear" — they *settle*: fade + rise + blur-out on scroll (`Reveal`/`Stagger`), letter-by-letter hero headlines (`SplitText`), inertial page scroll (Lenis, `lerp 0.105`), magnetic buttons, 3D tilt cards, parallax imagery. Every animation is transform/opacity only — **zero layout shift**.

### 2.5 Accessible by default
- `prefers-reduced-motion` is honored at *three* levels: a global CSS kill-switch, `MotionConfig reducedMotion="user"`, and per-component `useReducedMotion()` bail-outs (Lenis doesn't even initialize)
- Skip-link ("Zum Inhalt springen"), semantic landmarks, `sr-only` labels on stat lists
- A consistent keyboard focus style: bordeaux ring + ivory halo, ≥3:1 visible on both light and dark surfaces
- All decoration is `aria-hidden`; region images carry meaningful `alt` text

---

## 3. Design Tokens

Tokens live in two synchronized places: `tailwind.config.js` (utilities) and `:root` CSS variables in `app/globals.css` (semantic tokens).

### Color

| Token | Hex | Role |
|---|---|---|
| `bordeaux` | `#6B0F1A` | Primary brand — CTAs, accents, selection color |
| `bordeaux-deep` | `#43090F` | Hover fills, deep shadows |
| `wine` | `#8A2B2F` | Gradient partner to bordeaux |
| `champagne` | `#C8B77A` | Gold accent — hairlines, eyebrows, white-wine markers |
| `champagne-light` | `#E3D9B8` | Soft gold washes |
| `ivory` | `#F7F4EF` | Page background ("paper") |
| `cream` | `#FBF9F4` | Elevated surfaces |
| `stone` | `#D9D2C4` | Borders, scrollbar thumbs |
| `charcoal` | `#1B1B1B` | Body text |
| `espresso` | `#211511` | Image overlay gradients |

Ambient tints (in `Atmosphere.jsx`) extend this with translucent gold, blush, olive, sea and terracotta for the aurora fields.

### Typography

| Face | Variable | Role |
|---|---|---|
| **Playfair Display** (serif, incl. italic) | `--font-playfair` | Display headlines, stats, ghost words — the "voice" of the brand |
| **Montserrat** 300–700 (sans) | `--font-montserrat` | Body, UI, eyebrows — the "workhorse" |

Headline sizes are fluid: `clamp(2.8rem, 6vw, 4.6rem)` (hero), `clamp(2rem, 4.2vw, 3.2rem)` (section CTAs). Body text is deliberately small and quiet (12.5–15 px) with relaxed leading — editorial density.

### Shape, depth & motion tokens

```
max-w-content   1200px                 — the single content column
rounded-card    1.5rem / card-lg 2rem  — card radii
shadow-luxe     resting card shadow    — warm-tinted, large soft falloff
shadow-lift     hover card shadow      — same family, raised
shadow-glass    frosted panel          — inner white highlight + drop
shadow-chip     primary button         — bordeaux-tinted glow
ease-out-expo   cubic-bezier(0.16,1,0.3,1)
SPRING          { stiffness: 90, damping: 20, mass: 1 }
```

Reusable CSS utilities (`globals.css`): `.glass` (frosted backdrop-blur surface), `.grain` (film-grain overlay), `.ring-hairline` (inset gold ring), `.text-balance`, thin styled carousel scrollbars.

---

## 4. Project Structure

The storefront runs in four languages — German (unprefixed, at the root),
Italian, English and Czech (`/it`, `/en`, `/cs`). `/admin` stays German and
sits in its own route group with its own root layout, because `<html lang>`
has to name the real document language and a single root layout in `app/`
cannot know the locale without going dynamic. **See [I18N.md](I18N.md)** for
the routing rules, the dictionary layout and how to translate a page that is
still German.

```
app/
  (site)/[locale]/  The storefront, all four languages
    layout.jsx      Root layout — fonts, SmoothScroll provider, AmbientBackdrop,
                    skip-link, Header/Footer, per-locale metadata + hreflang
  (admin)/          Backoffice, German only — second root layout
  template.jsx      Route-change entrance (fade-rise) + Lenis scroll-to-top
  globals.css       Tokens, focus styles, utilities, keyframes, reduced-motion
  page.jsx          Home        — hero, marquee, philosophy, wine rail, regions,
                                  shop CTA band, magazine teasers
  weine/            Wine catalogue with interactive explorer/filters
  regionen/         The four Italian regions
  magazin/          Magazine — articles, filter panel, newsletter card
  kontakt/          Contact — form + FAQ

content/
  de|it|en|cs/      The dictionaries — one directory per language, same shape.
                    German is the source language and the legally binding
                    version of the legal texts.

lib/i18n/           Locale config, routing, dictionary loading, the client
                    context, per-locale formatting and page metadata (see I18N.md)

components/
  i18n/             LocaleLink (a next/link that carries the language) and the
                    LanguageSwitcher
  data.js           WINES — the single source of truth for the 9-wine catalogue.
                    Structure only (slug, price, year, typeKey, regionKey, dot,
                    photos); the visible text — wine type, region, tasting notes,
                    food pairing — lives in the dictionaries and is merged in at
                    render time. Filters compare keys, never labels.
  Header.jsx / Footer.jsx / Logo.jsx
  Atmosphere.jsx    Aura, Atmosphere variants, GhostWord, Vines, AmbientBackdrop
  Deco.jsx          SectionTitle, Eyebrow, GrapeRule, IconChip
  Bottle.jsx        Stylized SVG wine bottle (5 glass-color variants)
  WineCard.jsx / WineRail.jsx
  ItalyMap.jsx      SVG map with per-region highlight
  Icons.jsx         Hand-drawn icon set (vineyard, barrel, glasses, …)
  PhotoBlock.jsx
  ui/Button.jsx     The button system (5 variants × 3 sizes)
  motion/           The motion toolkit (see §5)
  home|weine|magazin|kontakt/   Page-specific client components

public/img/         Photography (hero, regions, food, still-life) + logo/crest
```

**Server/client split:** pages are server components (static HTML at build time); interactivity is isolated in small `"use client"` leaves (motion primitives, forms, explorer, header). The production build prerenders every route in all four languages — 85 pages — with ~87 kB shared JS. Only the active language's shared chrome copy reaches the browser; page text is passed down as props from server components.

---

## 5. The Motion Toolkit (`components/motion/`)

| Component | What it does |
|---|---|
| `SmoothScroll` | Global Lenis inertial scroll (`lerp 0.105`) in a rAF loop; context-exposed so the mobile menu can stop/start it; skipped entirely under reduced motion; wraps the app in `MotionConfig reducedMotion="user"` |
| `Reveal` | Viewport-triggered fade + rise + blur-in with the shared spring; fires once, slightly before entering (`-8%` margin) |
| `Stagger` / `StaggerItem` | Orchestrated children reveals, 0.09 s apart |
| `SplitText` | Letter-by-letter headline entrance (hero) |
| `Parallax` | Subtle scroll parallax for imagery (`speed ≈ 0.07`, with overscan so edges never show) |
| `TiltCard` | Pointer-tracking 3D tilt (max 4–5°) on cards |
| `Magnetic` | Cursor-attraction for buttons |
| `Marquee` | Infinite grape-variety ticker (46 s CSS loop) |
| `ShaderGradient` | Custom WebGL flowing color field — single fullscreen triangle + 5-octave fbm noise, brand palettes, scroll-reactive, CSS-gradient fallback |

### The button system (`ui/Button.jsx`)
One component, five variants (`primary` bordeaux gradient, `dark`, `outline`, `glass`, `light`) × three sizes. Micro-interactions are layered: magnetic cursor tracking → a fill that rises inside the pill → a masked label roll → arrow travel → press compression. All transform/opacity — no layout shift.

---

## 6. Page Blueprint (Home as the pattern)

Every page follows the same compositional recipe, established on the home page:

1. **Hero** — full-viewport (`min-h-[100svh]`), `ShaderGradient` background + grain, split headline (`SplitText`), eyebrow, `GrapeRule`, CTA pair, stat row (counts derived live from `data.js`), and a bottom gradient that "settles" into the ivory page color. Scroll cue on desktop.
2. **Marquee** — grape-variety ticker as a section divider.
3. **Content sections** — each one: `relative overflow-hidden` wrapper → an `Atmosphere` variant (`warm`/`olive`/`rose`/`dusk`) + a `GhostWord` → `SectionTitle` (eyebrow + serif headline + description) → a `Stagger` grid of `TiltCard`s.
4. **Cards** — `rounded-card-lg`, `ring-hairline` gold inset, `bg-white/70` over the ambient backdrop, `shadow-luxe → shadow-lift` on hover, images zoom `scale-1.05` with `ease-out-expo`.
5. **Dark CTA band** — the inverse moment: `wine`-palette shader + grain inside a rounded card, ivory serif headline with a champagne italic accent, `light`/`glass` buttons.
6. **Region cards** — photo + `Parallax`, espresso gradient overlay, a frosted `glass` chip holding the `ItalyMap` with the region highlighted.

Route changes animate through `app/template.jsx` — a weighted fade-rise that remounts per navigation and forces Lenis back to the top, keeping spatial continuity.

---

## 7. Data Model

There is deliberately **no CMS and no database**. The entire catalogue is `components/data.js`:

```js
{ name, region, variant, type, price, year, notes, dot }
```

- `variant` (`red | redsoft | amber | white | rose`) drives the SVG `Bottle` glass colors
- `dot` is the wine-type marker color (bordeaux / champagne / blush)
- `fmtPrice` formats German-style (`12,90 €`)
- `REGION_COUNT` is derived — the hero stats can never drift from the catalogue

Editing one file updates cards, rails, filters and counters everywhere.

---

## 8. Performance & Quality Choices

- **Static-first:** all routes prerender at build time; no server data fetching
- **GPU-only animation:** transforms and opacity exclusively; `will-change: transform` hints on drifting layers; no animated `filter: blur` on ambient layers
- **Self-hosted fonts** with `display: swap` and CSS-variable wiring — no FOIT, no external requests
- **Vector-first graphics:** bottles, map, icons, vines are inline SVG — crisp at every DPI, ~0 network cost
- **WebGL with graceful degradation:** the shader renders a static CSS gradient when WebGL is unavailable or motion is reduced
- **Reduced motion** disables Lenis, springs, marquee, auras and the shader animation in one global media query plus per-component checks

---

## 9. Build & Deployment

```bash
npm ci          # reproducible install (package-lock.json)
npm run dev     # local development
npm run build   # static production build (all routes ○ Static)
npm run start   # production server on :3000
```

Deployed on a **Hetzner** server via **Coolify** with the **Nixpacks** build pack: `nixpacks.toml` pins Node 20 and the install → build → start pipeline; Coolify maps port **3000**. No environment variables are required.
