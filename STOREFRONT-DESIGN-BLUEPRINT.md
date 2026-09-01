# Storefront Design Blueprint — Enoteca → Clinic

A teardown of the Maria Maria wine storefront (`/shop`), written so it can be
lifted out of this repository and used as the design brief for a **dental clinic
site**. Every pattern is given three times: what it is, the working code, and the
one change that makes it clinical instead of vinous.

---

## 0. How to read this document

**If you are an AI agent building the clinic site, read this section first.**

- **This file is self-contained.** It does not require access to the Maria Maria
  codebase. Every code block below is complete and runnable. File paths in
  §16 are provenance only — do not try to read them unless they exist.
- **Framework-neutral.** Code is given in plain CSS plus React/JSX. The original
  is Next.js 14 + Tailwind + Motion (Framer), but nothing here depends on that.
  Tailwind class names appear only where they name a token (`rounded-card-lg`).
- **The rules are numbered and imperative.** A line beginning with `RULE` is a
  hard constraint, not a suggestion. A line beginning with `CLINIC` is the
  required change when porting the pattern to a dental practice.
- **Do not port the palette.** Port the palette *structure* (§2). The wine hues
  are wrong for a clinic and using them is the single most obvious failure mode.
- **Priority order if you can only do part of it:** §4 (atmosphere), §5
  (watermarks), §6 (cards), §8 (motion). Those four produce most of the
  perceived quality. Everything else is refinement.
- **§14 lists what must NOT be copied.** Read it before writing any code. One
  item there (scarcity signals) is a regulatory issue, not a taste issue.

---

## 1. Design thesis

> A luxury print magazine that happens to move.

The site is not designed as e-commerce. It borrows from editorial print: a serif
display face, generous whitespace, uppercase letterspaced eyebrows, hairline
rules, one strict 1200px column. Products are presented as characters with
stories rather than as SKUs.

Five governing principles, in the order they matter:

1. **Editorial luxury, not e-commerce.** Layout decisions come from magazine
   design, not from shop templates.
2. **Every colour is derived from a physical material** in the subject's world.
3. **Atmosphere over flatness.** No section sits on a flat background (§4).
4. **Weighted, physical motion.** One spring and one easing curve for the whole
   site (§8). Elements do not appear — they settle.
5. **Accessible by default**, with reduced-motion handled at three levels (§13).

`CLINIC` — All five transfer unchanged. Principle 1 is the highest-leverage one:
a dental site built on editorial rather than medical-portal conventions is
already differentiated before a single colour is chosen.

---

## 2. Design tokens

### 2.1 The palette law

`RULE` **No pure white (`#FFF`) and no pure black (`#000`) anywhere.** The page
ground is tinted paper, text is a tinted near-black, and every shadow is warm-
or cool-tinted to match the palette — never neutral grey.

`RULE` **Every colour token is named after a material**, not after its lightness.
`champagne`, `stone`, `espresso` — never `gold-400`, `gray-300`. This forces
consistency: when a new surface is needed you ask "what material is this?"
instead of picking a lighter grey.

`RULE` **Text tints come from opacity on the ink token** (`charcoal/70`,
`charcoal/55`, `charcoal/45`), not from separate grey tokens. Every shade then
stays in one hue family automatically.

### 2.2 Structure of the palette

The palette has exactly six roles. Port the roles, replace the hues.

| Role | Purpose | Wine (original) | Clinic (target) |
|---|---|---|---|
| **Brand** | CTAs, prices, accents, selection colour | `#6B0F1A` bordeaux | `#123B4F` petrol |
| **Brand deep** | Hover fills, dark gradients | `#43090F` bordeaux-deep | `#0A2635` petrol-deep |
| **Brand mid** | Gradient partner to brand | `#8A2B2F` wine | `#1C566F` petrol-mid |
| **Metallic** | Hairlines, eyebrows, ribbons, rings | `#C8B77A` champagne | `#D8C3A5` sand |
| **Metallic light** | Soft washes, gradient ends | `#E3D9B8` champagne-light | `#EFE4D2` sand-light |
| **Accent wash** | The one "other" note, used sparingly | `#55683F` vine | `#CFE3DC` mint |
| **Paper** | Page ground | `#F7F4EF` ivory | `#F6F8F8` cool paper |
| **Surface** | Raised surfaces, card gradient ends | `#FBF9F4` cream | `#FCFDFD` card white |
| **Border** | Borders, scrollbar thumbs | `#D9D2C4` stone | `#D3DCDD` slate stone |
| **Ink** | Body text | `#1B1B1B` charcoal | `#16232B` ink |
| **Shadow ink** | Image overlay gradients | `#211511` espresso | `#0D1A21` deep ink |

`RULE` The **metallic** is the role people skip when copying this, and it is the
role that reads as expensive. Do not drop it.

`CLINIC` Resist making the whole site teal. Dental sites default to a wall of
cyan. Here mint appears **only** in gradient washes and icon chips, never as a
large fill. Warmth on a dental site is counter-signal — it reads as *care*
rather than *equipment*.

### 2.3 Token file

```css
:root {
  /* brand */
  --c-brand:        #123B4F;
  --c-brand-mid:    #1C566F;
  --c-brand-deep:   #0A2635;

  /* metallic */
  --c-metal:        #D8C3A5;
  --c-metal-light:  #EFE4D2;
  --c-metal-deep:   #A8916E;   /* dark enough for small caps on paper */

  /* accent */
  --c-accent:       #CFE3DC;

  /* neutrals — none of them pure */
  --c-paper:        #F6F8F8;
  --c-surface:      #FCFDFD;
  --c-border:       #D3DCDD;
  --c-ink:          #16232B;
  --c-ink-shadow:   #0D1A21;

  /* shape */
  --radius-card:    1.5rem;
  --radius-card-lg: 2rem;
  --max-content:    1200px;

  /* motion — see §8 */
  --ease-luxe:      cubic-bezier(0.16, 1, 0.3, 1);

  /* depth */
  --shadow-glass:   inset 0 1px 0 rgba(255,255,255,.65),
                    0 20px 50px -20px rgba(13,26,33,.28);
  --shadow-chip:    inset 0 1px 0 rgba(255,255,255,.7),
                    0 10px 24px -12px rgba(18,59,79,.28);
  --shadow-lift:    0 22px 40px -28px rgba(18,59,79,.45);
}
```

`RULE` Shadow colours are tinted with the brand hue, never `rgba(0,0,0,x)`.

### 2.4 Dark mode note

The original ships light-only. If the clinic site ships a dark theme, three
tokens need a genuine dark counterpart rather than an inversion:

- the **watermark opacity** (§5) — 5% of a light colour on a dark ground
  disappears entirely; use 8–10% of a *lighter* tint instead;
- the **card translucency** (§6) — `rgba(white,.75)` becomes
  `rgba(surface,.55)`, not `rgba(black,.75)`;
- the **glass utility** (§10) — the ivory base becomes the dark surface, and the
  inset white top highlight drops to ~30% or the pane looks plastic.

---

## 3. Typography

Two faces. No third.

| Role | Face | Used for |
|---|---|---|
| **Display** | Playfair Display (serif, incl. italic) | Headlines, prices, statistics, watermarks, card titles |
| **Workhorse** | Montserrat 300–700 (sans) | Body, UI, eyebrows, labels, chips |

### 3.1 The scale

```css
/* fluid display — one clamp per level, nothing bespoke */
h1 { font-size: clamp(2.6rem, 5.4vw, 4.1rem);
     line-height: 1.06; letter-spacing: -0.015em; }
h2 { font-size: clamp(1.75rem, 3.4vw, 2.6rem);
     line-height: 1.12; }
h3 { font-size: 19px; }                     /* card titles, serif */

/* the three quiet registers */
.body    { font-size: 13.5px; line-height: 1.62; color: rgb(22 35 43 / .70); }
.eyebrow { font-size: 11px;   text-transform: uppercase;
           letter-spacing: .24em; color: var(--c-metal-deep); }
.micro   { font-size: 9.5px;  text-transform: uppercase;
           letter-spacing: .16em; }         /* chips, badges, ribbons */
```

`RULE` Body copy is deliberately **small and quiet** while headlines are large.
The gap between them is the entire effect. 16px body next to a big serif reads
as a template; 13.5px body reads as editorial confidence.

`RULE` `text-wrap: balance` on every heading.

`RULE` `font-variant-numeric: tabular-nums` on every price, count and statistic,
so digits never jitter when a value changes.

`RULE` One italic accent word per headline, in the brand colour:
`Complete care <em>without the dread</em>`. Never more than one per heading.

`CLINIC` — **A serif is the highest-leverage single decision available.** It is
what separates "private practice" from "insurance portal". Pair a warm reading
serif (Newsreader, Fraunces, Source Serif 4) with a neutral grotesque. Put the
serif on treatment names, prices, and the practitioner's name.

`CLINIC` — **Override the small-body rule.** Wine buyers browse; patients read
consent, aftercare and pricing. Set clinical body copy to **16px minimum**. Keep
the 9.5–11px register for chips and labels only. This is an accessibility floor,
not a preference — see §13.

---

## 4. Atmosphere layers — the core law

`RULE` **No section sits on a flat background.**

Every section is a `position: relative; overflow: hidden` wrapper with an ambient
stack beneath the content. All layers are `aria-hidden="true"`,
`pointer-events: none`, and animate **transform and opacity only**.

Four layers, in order of value-for-effort:

### 4.1 Auras (do this first)

Three enormous radial-gradient blobs (30–38rem), positioned mostly off-canvas,
drifting on 34–44 second loops in **opposite phases** so they never sync.

`RULE` Never blur them with `filter: blur()`. A radial gradient *is* the blur and
costs nothing on the GPU; an animated `filter` forces repaints.

```css
.aura {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  will-change: transform;
}

/* two drift variants, deliberately different durations and phases */
@keyframes aura-a {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50%      { transform: translate3d(4%, -6%, 0) scale(1.15); }
}
@keyframes aura-b {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1.1); }
  50%      { transform: translate3d(-5%, 5%, 0) scale(0.92); }
}
.aura--a { animation: aura-a 36s ease-in-out infinite; }
.aura--b { animation: aura-b 44s ease-in-out infinite; }
```

```jsx
/* Atmosphere.jsx — named recipes stop this becoming soup */
const TINTS = {
  sand:    "rgba(216,195,165,.55)",
  mint:    "rgba(207,227,220,.60)",
  petrol:  "rgba(18,59,79,.16)",
  blush:   "rgba(198,160,150,.24)",
  slate:   "rgba(120,140,150,.22)",
};

export function Aura({ tint = "sand", drift = 1, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`aura ${drift === 2 ? "aura--b" : "aura--a"} ${className}`}
      style={{
        background: `radial-gradient(circle, ${TINTS[tint] ?? TINTS.sand} 0%, transparent 68%)`,
      }}
    />
  );
}

/* Four named recipes. Each section picks one; consecutive sections then feel
   different without anyone hand-tuning blob positions. */
const VARIANTS = {
  calm:   [ { tint: "mint",   drift: 1, cls: "-left-48 -top-48 h-[38rem] w-[38rem]" },
            { tint: "sand",   drift: 2, cls: "-right-56 top-1/4 h-[34rem] w-[34rem]" },
            { tint: "petrol", drift: 1, cls: "-bottom-64 left-1/4 h-[32rem] w-[32rem]" } ],
  warm:   [ { tint: "sand",   drift: 1, cls: "-right-48 -top-40 h-[36rem] w-[36rem]" },
            { tint: "blush",  drift: 2, cls: "-left-56 top-1/3 h-[34rem] w-[34rem]" },
            { tint: "mint",   drift: 1, cls: "-bottom-56 right-1/4 h-[30rem] w-[30rem]" } ],
  clinical: [ { tint: "slate",  drift: 1, cls: "-left-48 -top-40 h-[36rem] w-[36rem]" },
              { tint: "mint",   drift: 2, cls: "-right-48 top-1/2 h-[34rem] w-[34rem]" },
              { tint: "sand",   drift: 1, cls: "-bottom-64 left-1/3 h-[30rem] w-[30rem]" } ],
  dusk:   [ { tint: "petrol", drift: 1, cls: "-right-48 -top-48 h-[36rem] w-[36rem]" },
            { tint: "sand",   drift: 2, cls: "-left-56 top-1/4 h-[34rem] w-[34rem]" },
            { tint: "blush",  drift: 1, cls: "-bottom-56 right-1/3 h-[32rem] w-[32rem]" } ],
};

export default function Atmosphere({ variant = "calm", className = "" }) {
  const blobs = VARIANTS[variant] ?? VARIANTS.calm;
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {blobs.map((b, i) => <Aura key={i} tint={b.tint} drift={b.drift} className={b.cls} />)}
    </div>
  );
}
```

There is also a **global** version: a `position: fixed; inset: 0; z-index: -1`
backdrop with three auras, sitting above the body colour and below all content.
It kills flat voids in the gaps between decorated sections.

### 4.2 Film grain (cheapest win in the whole document)

One inline SVG `feTurbulence` as a data URI. It is the difference between
"gradient" and "printed".

```css
/* attach to any position:relative container */
.grain::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: .5;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.32'/%3E%3C/svg%3E");
}
```

### 4.3 Line art

A hand-drawn SVG stroked at 1.1px in the translucent metallic, sitting at a
section's bottom edge. On the wine site: vine rows, a low sun, a grape cluster.

```jsx
export function LineArt({ className = "", stroke = "rgba(216,195,165,.45)" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 1440 480"
         preserveAspectRatio="xMidYMax slice"
         className={`pointer-events-none absolute ${className}`}
         fill="none" stroke={stroke} strokeWidth="1.1" strokeLinecap="round">
      {/* rolling ground lines */}
      <path d="M-40 380 C 200 300, 460 310, 720 350 S 1220 390, 1480 310" />
      <path d="M-40 424 C 240 352, 520 362, 780 396 S 1240 424, 1480 362" strokeOpacity=".6" />
      <path d="M-40 336 C 180 276, 400 282, 640 314 S 1180 352, 1480 268" strokeOpacity=".35" />
      {/* a subject motif — replace with yours */}
      <circle cx="1180" cy="130" r="54" strokeOpacity=".55" />
      <circle cx="1180" cy="130" r="82" strokeOpacity=".25" />
    </svg>
  );
}
```

`CLINIC` Replace the vine motif with the same idea drawn from dentistry: a single
continuous line describing a molar's silhouette, an arch of teeth, or the curve
of a chair. Keep the rolling ground lines — they are what makes it read as
landscape rather than as clip art.

### 4.4 WebGL shader gradient (hero only)

A slowly flowing colour field: one fullscreen triangle plus five-octave fbm
noise. **No three.js.** It reacts to scroll, pauses off-screen via
`IntersectionObserver`, and falls back to a static CSS gradient when WebGL is
missing or motion is reduced.

`RULE` Use it in exactly two places: the home hero and the dark CTA band.
Everywhere else, auras + grain give ~80% of the depth for none of the cost.

```jsx
const PALETTES = {
  /* light hero — paper → sand → warm clay */
  dawn:   ["#F6F8F8", "#E4EDEA", "#D8C3A5", "#A8916E"],
  /* dark CTA band — deep petrol with a metallic glow */
  deep:   ["#08202C", "#0E3A4D", "#1C566F", "#D8C3A5"],
};

const FRAG = `
precision mediump float;
uniform vec2 u_res; uniform float u_time; uniform float u_scroll;
uniform vec3 u_c0, u_c1, u_c2, u_c3;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x),
             mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p*2.03 + vec2(11.3,7.9); a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p  = vec2(uv.x * u_res.x / u_res.y, uv.y);
  float t = u_time * 0.045 + u_scroll * 0.55;
  vec2 q = vec2(fbm(p*1.25 + vec2(t*0.55,-t*0.25)),
                fbm(p*1.25 + vec2(-t*0.35,t*0.4) + 4.7));
  float n1 = fbm(p*1.6 + 2.2*q + vec2(t*0.2, 0.0));
  float n2 = fbm(p*2.6 - 1.6*q - vec2(0.0, t*0.28));
  vec3 col = mix(u_c0, u_c1, smoothstep(0.18, 0.82, n1));
  col = mix(col, u_c2, smoothstep(0.38, 0.94, n2) * 0.88);
  col = mix(col, u_c3, pow(smoothstep(0.52,1.0, fbm(p*3.4 + q + t*0.16)), 2.2) * 0.55);
  /* vignette keeps edges quiet so foreground copy stays readable */
  col *= 1.0 - 0.16 * smoothstep(0.25, 0.95, length(uv - vec2(0.5, 0.55)));
  gl_FragColor = vec4(col, 1.0);
}`;
```

Non-negotiable implementation details:

- Render the CSS gradient fallback in a sibling `<div>` **underneath** the
  canvas. If `linkProgram` fails, set `canvas.style.display = "none"` so the
  fallback shows rather than an opaque black rectangle.
- Cap DPR at 1.5 — `Math.min(window.devicePixelRatio || 1, 1.5)`.
- Repaint once after every `ResizeObserver` fire: reassigning `canvas.width`
  clears the buffer, and reduced-motion users get no further frames otherwise.
- Call `gl.getExtension("WEBGL_lose_context")?.loseContext()` on unmount.

---

## 5. Watermarks (GhostWord)

One enormous italic serif word floating behind each section.

```css
.ghost-word {
  position: absolute;
  right: -3vw;              /* MUST bleed off an edge */
  top: 2rem;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 11vw;
  line-height: 1;
  color: rgb(18 59 79 / .055);   /* brand colour at 5–7% */
  white-space: nowrap;
  user-select: none;
  pointer-events: none;
}
```

```jsx
<span aria-hidden="true" className="ghost-word">Prophylaxis</span>
```

Three things make this read as printing rather than as a styling mistake:

1. `RULE` **The word is in another language.** On the wine site: *Degustazione*,
   *Enoteca*, *Due anime*, *Un regalo*, *Servizio*. A watermark repeating the
   English headline is redundant; one in the brand's mother tongue is texture
   and heritage at once.
2. `RULE` **It bleeds off the section edge.** Fully contained, it reads as a
   headline you failed to style. Half off-canvas, it reads as print.
3. `RULE` **It sits above the auras and below the content**, so the drifting
   colour passes underneath it.

`RULE` One word per section. Never repeat a word on the same page.

The same trick runs at small scale **inside** components — a card prints its own
name at `3.4rem` italic in 7% brand behind its imagery; the hero stage prints a
single word at `6rem` behind the product group. It is a system, not a one-off.

`CLINIC` Vocabulary: clinical Latin and the language of care — *Prophylaxis*,
*Implantologia*, *Dentes*, *Sorriso*, *In cura*, *Restauro* — or the practice's
own name. Test at 5% and 8% against your actual ground colour and pick by eye; on
cooler paper the same opacity reads darker than it does on ivory.

---

## 6. Card system

Every card is the same six ingredients.

```css
.card {
  position: relative;
  border-radius: var(--radius-card-lg);          /* 2rem — one token, never mixed */
  background: rgb(252 253 253 / .75);            /* translucent: auras drift through */
  border: 1px solid rgb(216 195 165 / .45);      /* reactive ring */
  box-shadow: inset 0 0 0 1px rgb(216 195 165 / .30);  /* constant metallic hairline */
  transition: border-color .5s var(--ease-luxe),
              transform    .45s var(--ease-luxe),
              box-shadow   .5s var(--ease-luxe);
}

@media (hover: hover) {                          /* never sticky on touch */
  .card:hover {
    border-color: rgb(216 195 165 / 1);
    transform: translateY(-4px);
    box-shadow: inset 0 0 0 1px rgb(216 195 165 / .55), var(--shadow-lift);
  }
}
```

1. **Radius `2rem`**, one token, never mixed on a page.
2. **Translucent fill** — the ambient auras drift *through* the card. This is why
   the cards feel like part of the page instead of objects sitting on it.
3. **A hairline metallic ring** as an `inset` box-shadow, not a border, so it
   does not affect layout and can coexist with a real border.
4. **A real border** in the neutral that warms to the metallic on hover. Two
   rings: one constant, one reactive.
5. **Hover = border colour + a 4–6px lift.** Note what is absent: the original
   set `shadow-luxe: none` and `shadow-lift: none`, keeping the token names so
   every existing class still resolves. Hover reads as colour and position, not
   as a shadow bloom.
6. **A 3D tilt** of max 4–6°, spring-damped, with a metallic glare tracking the
   pointer (§6.2).

### 6.1 Card accents

```jsx
/* Ribbon — featured item. pointer-events-none so it never eats a click. */
<span className="pointer-events-none absolute right-4 top-4 z-10 rounded-full
                 bg-gradient-to-br from-[--c-metal] to-[--c-metal-light]
                 px-3 py-1.5 text-[9.5px] font-semibold uppercase
                 tracking-[.16em] text-[#4A3B24] shadow-chip">
  Most chosen
</span>

/* IconChip — 56px circle, surface→accent gradient, same hairline ring. */
export function IconChip({ children, size = "md" }) {
  const s = size === "lg" ? "h-16 w-16" : "h-14 w-14";
  return (
    <span className={`inline-flex ${s} items-center justify-center rounded-full
                      bg-gradient-to-br from-[--c-surface] to-[--c-accent]/55
                      text-[--c-brand]`}
          style={{ boxShadow: "inset 0 0 0 1px rgb(216 195 165 / .40)" }}>
      {children}
    </span>
  );
}
```

`RULE` Icons are hand-drawn inline SVG on a 24×24 box, `fill: none`,
`stroke: currentColor`, `stroke-width: 1.5` (1.3 for 48×48 feature icons),
round caps and joins. No icon package. The consistent stroke weight is what makes
a bespoke set look like a set.

### 6.2 TiltCard

```jsx
"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "motion/react";

export default function TiltCard({ children, className = "", max = 6,
                                   glare = true, lift = true }) {
  const ref = useRef(null);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const gx = useMotionValue(50), gy = useMotionValue(50);
  const spring = { stiffness: 160, damping: 18, mass: 0.6 };
  const srx = useSpring(rx, spring), sry = useSpring(ry, spring);
  const glareBg = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%,
                                    rgba(255,246,220,.28), transparent 62%)`;

  const onMove = (e) => {
    if (e.pointerType === "touch") return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 2 * max);
    rx.set(-(py - 0.5) * 2 * max);
    gx.set(px * 100); gy.set(py * 100);
  };
  /* reset the glare too, or the shimmer freezes at the last cursor position
     and visibly jumps on the next hover */
  const onLeave = () => { rx.set(0); ry.set(0); gx.set(50); gy.set(50); };

  return (
    <motion.div ref={ref} style={{ perspective: 1000 }} className={className}
                onPointerMove={onMove} onPointerLeave={onLeave}
                initial="rest" whileHover="hover" animate="rest">
      <motion.div
        variants={lift ? { rest: { y: 0, scale: 1 }, hover: { y: -6, scale: 1.012 } } : undefined}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d",
                 willChange: "transform" }}
        className="relative h-full rounded-[--radius-card-lg]">
        {children}
        {glare && (
          <motion.div aria-hidden="true" style={{ background: glareBg }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0
                       transition-opacity duration-500 group-hover:opacity-100" />
        )}
      </motion.div>
    </motion.div>
  );
}
```

Two traps this solves, both worth understanding before you reimplement:

- **Pointer tracking and hover sensing must live on the stationary perspective
  wrapper**, not on the tilting card. Sensing on the moving element loops
  enter/leave at its edges and jitters while scrolling under the cursor.
- **`whileHover` fires on `pointerenter`, and on touch the matching
  `pointerleave` never arrives** — the card stays permanently lifted. Tailwind's
  `hoverOnlyWhenSupported` protects CSS `:hover` but not this JS state, so guard
  it by hand with a touch check.

`RULE` Set `future: { hoverOnlyWhenSupported: true }` in `tailwind.config.js`
(or the equivalent `@media (hover: hover)` wrapper in plain CSS) so a tap never
leaves a card in a half-finished hover state.

### 6.3 Elements inside a "stage"

The bundle card's imagery sits in a fixed-height stage with three sub-layers:

```jsx
<div className="relative flex h-56 items-end justify-center overflow-hidden
                bg-gradient-to-b from-[--c-surface] to-[--c-accent]/20 pt-6">

  {/* 1 — radial glow that brightens on hover */}
  <div aria-hidden="true"
       className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2
                  -translate-y-1/2 rounded-full opacity-70 transition-opacity
                  duration-500 group-hover:opacity-100"
       style={{ background: "radial-gradient(closest-side, rgb(216 195 165 / .36), rgb(216 195 165 / .1) 55%, transparent 75%)" }} />

  {/* 2 — the card's own name as a small watermark */}
  <span aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2
                   whitespace-nowrap font-serif text-[3.4rem] italic leading-none
                   text-[--c-brand]/[.07]">
    Complete care
  </span>

  {/* 3 — the objects, fanned, spreading further apart on hover */}
  <div className="relative flex items-end pb-6">{/* … */}</div>

  {/* 4 — a contact shadow ellipse, blurred, under the group */}
  <span aria-hidden="true"
        className="absolute bottom-11 left-1/2 h-2.5 w-60 -translate-x-1/2
                   rounded-full bg-[--c-ink]/15 blur-[6px]" />
</div>
```

The fan is pure class strings per index — rotation, negative margin, and an
extra rotation + translate on group-hover:

```js
const FAN = {
  3: ["-rotate-[9deg] -mr-5 group-hover:-rotate-[13deg] group-hover:-translate-x-1.5",
      "z-10",
      "rotate-[9deg] -ml-5 group-hover:rotate-[13deg] group-hover:translate-x-1.5"],
};
```

`CLINIC` The mechanic — *a group of objects that spreads apart on hover* — is
what makes the card feel alive, not the objects. Fan three before/during/after
photographs, or three overlapping appointment cards.

### 6.4 Package / bundle card footer

```
┌──────────────────────────────────────┐
│  [stage: fanned imagery + watermark] │
├──────────────────────────────────────┤  ← border-top, neutral/40
│  EYEBROW (metallic, .22em)           │
│  Name  ·  4 sessions   ← serif + micro│
│  Short description, 12.5px            │
│  • item                        year   │  ← dot uses per-item colour
│  • item                        year   │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │  ← border-dashed
│  Single  £190 (struck)      [Save £45]│
│  £145  ← serif 26px, brand colour     │
│  [ Add to plan            → ]         │
│  (fixed 28px slot for confirmation)   │
└──────────────────────────────────────┘
```

`RULE` The confirmation link ("View plan") lives in a **fixed-height slot**
(`h-7`) that exists whether or not the link is shown, so confirming never shifts
the layout.

---

## 7. The anti-card

The most instructive decision on the page is the one place the card was
**deleted**. The main catalogue grid has no card, no stage, no glow — imagery and
text float directly on the page ground, separated only by a hairline that skips
the first item in each column.

```css
/* every grid item */
.listing-item { border-top: 1px solid transparent; padding: 2rem 0 1.5rem; }
.listing-item:nth-child(n + 2) { border-top-color: rgb(22 35 43 / .10); }

@media (min-width: 640px)  { .listing-item:nth-child(2) { border-top-color: transparent; } }
@media (min-width: 1024px) { .listing-item:nth-child(3) { border-top-color: transparent; } }
```

`RULE` **When a listing is the page's substance, framing every item competes with
it.** Cards are for things compared as options (packages). Hairlines are for
things browsed as a collection (the treatment list).

### 7.1 Stretched link

```jsx
<div className="group relative flex items-stretch gap-5">
  <div className="w-[84px] shrink-0">{/* imagery */}</div>
  <div className="flex min-w-0 flex-1 flex-col pt-1">
    <span aria-hidden="true" className="font-serif text-[19px] text-[--c-brand]">01</span>
    <h3 className="mt-3 font-serif text-[19px] italic text-[--c-ink]
                   transition-colors group-hover:text-[--c-brand]">
      {/* the anchor stretches over the whole row */}
      <a href={href} aria-label={`Details for ${name}`}
         className="outline-none after:absolute after:inset-0">
        {name}
      </a>
    </h3>
    {/* interactive children sit ABOVE the stretched link */}
    <div className="relative z-10 mt-4 flex items-center justify-between">
      <p className="text-[15px] font-semibold tabular-nums">{price}</p>
      <BookButton />
    </div>
  </div>
</div>
```

`RULE` The stretched link is the correct way to get a large tap target without
nesting interactive elements (a real accessibility failure and a common one).
Anything else clickable in the row must sit on `z-10` above it.

---

## 8. Motion system

`RULE` **Two motion constants for the whole site.** Restriction is where the
coherence comes from.

```js
export const SPRING = { type: "spring", stiffness: 90, damping: 20, mass: 1 };
export const EASE    = "cubic-bezier(0.16, 1, 0.3, 1)";   // "ease-out-expo"

/* faster members of the same family — only stiffness really moves */
export const GRID_SPRING  = { type: "spring", stiffness: 300, damping: 30 };
export const TILT_SPRING  = { stiffness: 160, damping: 18, mass: 0.6 };
export const PRESS_SPRING = { type: "spring", stiffness: 400, damping: 22 };
```

`RULE` **Transform and opacity only.** Nothing in the motion system may cause
layout shift.

### 8.1 Reveal / Stagger

```jsx
"use client";
import { motion } from "motion/react";

const SPRING = { type: "spring", stiffness: 90, damping: 20, mass: 1 };

export function Reveal({ children, className = "", delay = 0, y = 28,
                         blur = true, once = true, amount = 0.25, priority = false }) {
  const touch = useTouchDevice();
  const firstLoad = useFirstLoad();
  if (priority && firstLoad) return <div className={className}>{children}</div>;

  /* animated blur forces expensive repaints on mobile GPUs — drop it on touch */
  const useBlur = blur && !touch;
  const travel  = touch ? Math.min(y, 20) : y;

  return (
    <motion.div
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: travel, filter: useBlur ? "blur(8px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)",
                     transitionEnd: { filter: "none" } }}
      viewport={{ once, amount, margin: "0px 0px -8% 0px" }}
      transition={{ ...SPRING, delay,
        opacity: { duration: .55, delay, ease: [.16, 1, .3, 1] },
        filter:  { duration: .60, delay, ease: [.16, 1, .3, 1] } }}>
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className = "", gap = 0.09, delay = 0 }) {
  return (
    <motion.div data-reveal="" className={className}
      initial="hidden" whileInView="visible"
      viewport={{ once: true, amount: .18, margin: "0px 0px -6% 0px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: gap,
                                                       delayChildren: delay } } }}>
      {children}
    </motion.div>
  );
}
```

`RULE` `once: true` always. A reveal that replays on scroll-back reads as a
glitch, not as polish.

`RULE` `viewport.margin: "0px 0px -8% 0px"` — fire slightly *before* the element
enters, so it is already settled when the reader arrives at it.

`RULE` **`priority` on above-the-fold content.** A hero starting at
`opacity: 0` is not counted by the browser for FCP or LCP until it fades in, and
staged delays (up to 0.78s on the original) land directly on top of hydration
time. `priority` renders plain server HTML on first paint and restores the
animation from the first client navigation onward. See §13 for why this branch is
hydration-safe while a `matchMedia` branch is not.

### 8.2 SplitText

Words rise out of an `overflow: hidden` clip with a slight rotation.

```jsx
export default function SplitText({ text, className = "", wordClassName = "",
                                     delay = 0, stagger = 0.05, as: Tag = "span" }) {
  const words = String(text).split(" ");
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden="true"
              className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            data-reveal=""
            className={`inline-block will-change-transform ${wordClassName}`}
            initial={{ y: "112%", rotate: 2.5 }}
            whileInView={{ y: "0%", rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 110, damping: 22,
                          mass: .9, delay: delay + i * stagger }}>
            {word}{i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
```

Three details that are easy to get wrong:

- The separator is **U+00A0**, not a plain space. A plain space collapses at the
  end of an `inline-block` and the words merge.
- `pb-[0.12em] -mb-[0.12em]` gives descenders room inside the clip without
  changing the line box.
- `aria-label` on the wrapper carries the plain string; the word spans are
  `aria-hidden`. Crawlers and screen readers get clean text.
- A gradient on the text must be applied **per word** (`wordClassName`), not on
  the outer wrapper — `background-clip: text` does not paint through the
  `overflow: hidden` spans.

### 8.3 Inertial smooth scroll

Lenis at `lerp: 0.105`, exposed through React context so overlays can stop and
start it.

`RULE` **Disable it on touch devices** —
`window.matchMedia("(hover: none) and (pointer: coarse)")`. Native inertial
scroll on iOS and Android runs on the compositor; replacing it with a per-frame
JS loop cost the original 420–450ms of blocking time on exactly the devices that
can least afford it, for a benefit nobody perceives.

`RULE` **Run Lenis inside the animation library's frame loop, not its own rAF.**
Two independent rAF loops are the actual cause of "swimming" parallax and pinned
layers: Lenis writes the scroll position in loop A, Motion measures it in loop B,
and depending on ordering a whole frame sits between write and measure.

```jsx
/* Motion's step order: setup → read → resolveKeyframes → preUpdate → update → render
   Motion measures scroll in `read`, so Lenis must write in `setup` — the only
   step before it. `update` is too late and costs a frame. */
tick = ({ timestamp }) => lenis.raf(timestamp);
frame.setup(tick, /* keepAlive */ true);
```

Also listen for **changes** to both media queries, not just the mount value — an
iPad switches between fine and coarse pointer when a trackpad is attached, and a
user can toggle reduced motion mid-session.

### 8.4 Route transitions

A weighted fade-rise that remounts per navigation and forces the scroll back to
the top, preserving spatial continuity between pages.

---

## 9. Button system

One component. Every variant stacks the same five layers, all transform/opacity,
zero layout shift.

```css
.btn {
  position: relative;
  isolation: isolate;
  display: inline-flex; align-items: center; justify-content: center; gap: .625rem;
  border-radius: 999px;
  overflow: hidden;
  font-weight: 500; text-transform: uppercase; letter-spacing: .14em;
  transition: box-shadow .3s;
}

/* sizes — min-height, NEVER a fixed height (see rule below) */
.btn--sm { min-height: 40px; padding: .625rem 1.25rem; font-size: 12px; }
.btn--md { min-height: 44px; padding: .75rem 1.5rem;   font-size: 12.5px; }
.btn--lg { min-height: 52px; padding: .875rem 2rem;    font-size: 13.5px; }

/* 1 — rising fill: the layer that carries the whole effect */
.btn .fill {
  position: absolute; inset: 0; z-index: 0;
  transform: translateY(103%);
  border-radius: 46% 46% 0 0;
  background: var(--c-brand-deep);
  transition: transform .5s var(--ease-luxe), border-radius .5s var(--ease-luxe);
}
.btn:hover .fill { transform: translateY(0); border-radius: 0; }

/* 2 — shine sweep */
.btn .sheen { position: absolute; inset: 0; z-index: 1; overflow: hidden; border-radius: 999px; }
.btn .sheen > i {
  position: absolute; top: 0; height: 100%; width: 33%;
  transform: translateX(-260%) skewX(-12deg);
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / .40), transparent);
  transition: transform .9s var(--ease-luxe);
}
.btn:hover .sheen > i { transform: translateX(360%) skewX(-12deg); }

/* 3 — glow */
.btn .glow {
  position: absolute; inset: 0; border-radius: 999px; opacity: 0;
  transition: opacity .5s;
  background: radial-gradient(circle, rgb(255 255 255 / .10) 0%, transparent 70%);
}
.btn:hover .glow { opacity: 1; }

/* 4 — masked label roll */
.btn .roll { position: relative; z-index: 10; display: block; overflow: hidden; }
.btn .roll > span { display: block; transition: transform .5s var(--ease-luxe); }
.btn .roll > .in  {
  position: absolute; inset: 0; display: block;
  transform: translateY(115%);
  transition: transform .5s var(--ease-luxe);
}
.btn:hover .roll > span { transform: translateY(-115%); }
.btn:hover .roll > .in  { transform: translateY(0); }

/* 5 — icon travel (press compression is JS: whileTap scale .96) */
.btn .arrow { position: relative; z-index: 10; transition: transform .5s var(--ease-luxe); }
.btn:hover .arrow { transform: translateX(4px); }
```

The rising fill's **curved top edge flattening as it arrives**
(`46% 46% 0 0` → `0`) is what makes it read as liquid rather than as a wipe. Do
not drop the `border-radius` half of that transition.

### 9.1 The duplicate-text trap in layer 4

The incoming label copy was originally a second text node. That duplicated every
link's text in the DOM — `"Book nowBook now"` in `innerText`, in every SEO crawl,
and in anything a user copied — despite being `aria-hidden`.

`RULE` For string children, render the incoming copy as **generated content**:

```jsx
{typeof children === "string" ? (
  <span aria-hidden="true" data-label={children}
        className="in before:content-[attr(data-label)]" />
) : (
  <span aria-hidden="true" className="in">{children}</span>
)}
```

Generated content sits outside `textContent`/`innerText` but inherits font, case
and tracking exactly. For non-string children (icons, fragments) the node copy
stays.

### 9.2 Sizing rules

`RULE` **`min-height` plus padding, never a fixed `height`.** A fixed height
silently clips any label that wraps in a narrow column — this was caught in
production with an 89px label inside a 44px pill.

`RULE` A stacked CTA pair gets **one shared max-width** (`max-w-[17.5rem]`) with
`items-stretch`, so both pills align on a single vertical axis with the eyebrow,
headline and body text above them.

### 9.3 Variant set

`CLINIC` Ship **three** variants, not the original's ten:

| Variant | Base | Fill on hover |
|---|---|---|
| `primary` | `linear-gradient(135deg, brand, brand-mid)`, paper text, `shadow-chip` | `brand-deep` |
| `outline` | `1px solid brand/40` on `linear-gradient(135deg, paper/85, metal-light/55)`, `backdrop-blur(6px)`, brand text | `linear-gradient(135deg, brand, brand-mid)` |
| `glass` | the `.glass` utility (§10.2), ink text | `brand` |

`CLINIC` Slow the layers slightly (600ms rather than 500) and **drop the shine
sweep on the primary booking button.** Sparkle on "Book now" reads as sales
pressure; sparkle on "See our work" does not. Keep the sweep on secondary and
gallery CTAs.

---

## 10. Header chrome

### 10.1 Three behaviours

1. **A 2px reading-progress bar** across the very top, gradient from metallic
   through brand, driven by a spring-smoothed `scrollYProgress`
   (`{ stiffness: 120, damping: 28, mass: .4 }`), `transform-origin: left`.
2. **A morph at 28px of scroll.** Transparent, full-width, 96px tall → a frosted
   glass pill: `max-width: 1060px`, `border-radius: 999px`, 64px tall, inset
   margins, over 500ms on the shared easing. The logo shrinks 96px → 76px in the
   same transition.
3. **A shared-layout underline.** The active item's underline is one element with
   a `layoutId`, so it physically slides between items instead of cross-fading.
   Inactive items get a `scale-x-0 → 1` underline on hover from the same origin.

```jsx
const { scrollY, scrollYProgress } = useScroll();
const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: .4 });

/* Read scroll from the animation library's existing per-frame measurement.
   A second `scroll` listener reads window.scrollY OUTSIDE the frame loop and
   forces a layout read mid-scroll while the smooth-scroll library is writing
   in the same frame. */
useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 28));

/* Back-navigation restores scroll position before any "change" fires */
useEffect(() => setScrolled(scrollY.get() > 28), [scrollY]);
```

`RULE` The logo link gets `shrink-0`. Without it, the logo is the first flex
child to give way when the row gets crowded — the original's 96px wordmark was
silently squeezed to 39px (7px in Czech) before this was caught. If the row
overflows, it should visibly break rather than quietly rob the wordmark.

### 10.2 The glass utility

```css
.glass {
  background: rgb(252 253 253 / .72);
  -webkit-backdrop-filter: blur(18px) saturate(1.5);
          backdrop-filter: blur(18px) saturate(1.5);
  border: 1px solid rgb(255 255 255 / .55);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .65),
              0 20px 50px -20px rgb(13 26 33 / .28);
}

/* dark variant, for overlays over photography */
.glass-dark {
  background: linear-gradient(to bottom, rgb(13 26 33 / .32), rgb(13 26 33 / .55));
  backdrop-filter: blur(22px) saturate(1.4);
  border: 1px solid rgb(255 255 255 / .14);
}

/* brand-tinted glass, for the dark CTA band: a translucent pane over the
   shader, so the gradient shows THROUGH rather than being covered */
.glass-brand {
  position: relative;
  background: linear-gradient(150deg, rgb(28 86 111 / .34) 0%,
                                      rgb(18 59 79 / .46) 46%,
                                      rgb(10 38 53 / .56) 100%);
  backdrop-filter: blur(26px) saturate(1.65);
  border-top: 1px solid rgb(255 255 255 / .22);
  border-bottom: 1px solid rgb(216 195 165 / .16);
}
/* the "thickness" of the pane: a lit top edge with a soft falloff */
.glass-brand::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background:
    linear-gradient(to bottom, rgb(255 255 255 / .16) 0%, rgb(255 255 255 / 0) 42%),
    radial-gradient(120% 80% at 50% 0%, rgb(216 195 165 / .14) 0%, rgb(216 195 165 / 0) 70%);
}
```

`RULE` `saturate(1.5)` is the ingredient most implementations miss. Blur alone
produces grey mud; boosting saturation lets the colour behind the pane sing
through it, which is what real frosted glass does. The inset white top highlight
is the second half — it gives the pane thickness.

### 10.3 Chips

```jsx
<span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-2
                 text-[9.5px] font-semibold uppercase tracking-[.16em]
                 text-[--c-ink]/70 shadow-glass">
  <Icon className="h-4 w-4 text-[--c-brand]" /> Pain-free
</span>
```

`RULE` If chips float over a hero stage that only exists at `lg` and above, they
must **also** appear as a compact wrapped row on smaller screens. The original
lost its shipping, payment and packaging promises entirely on mobile before this
was caught.

`CLINIC` Add a persistent **emergency / call** affordance the wine site does not
need: inside the pill on desktop, as a fixed bottom pill on mobile, using the
same `.glass` treatment as the floating cart pill (§11.3).

---

## 11. Commerce → care components

### 11.1 The morphing control

A circular add button that morphs into a quantity stepper, inside a **fixed-size
slot** so the morph can never shift layout.

```jsx
<div className="relative z-10 h-11 w-[118px] shrink-0">
  <AnimatePresence initial={false}>
    {qty === 0 ? (
      <motion.button key="add" onClick={add} aria-label={`Add ${name}`}
        initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: .8 }} transition={{ type: "spring", stiffness: 320, damping: 24 }}
        whileTap={{ scale: .9 }}
        className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center
                   rounded-full bg-[--c-brand] text-[--c-paper] shadow-chip">
        <PlusIcon className="h-[18px] w-[18px]" />
      </motion.button>
    ) : (
      <motion.div key="stepper" /* …same spring… */
        className="absolute inset-0 flex items-center justify-between rounded-full
                   bg-[--c-brand] px-1 text-[--c-paper] shadow-chip">
        <button onClick={decrement} aria-label={`Remove one ${name}`}>−</button>
        {/* re-keyed so the number itself springs on change */}
        <motion.span key={qty} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                     aria-live="polite" className="text-[13px] font-semibold tabular-nums">
          {qty}
        </motion.span>
        <button onClick={add} aria-label={`Add one ${name}`}>+</button>
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

`RULE` `aria-live="polite"` on the count. `z-10` so it sits above any stretched
link (§7.1).

### 11.2 The drawer that becomes a sheet

One component, two shapes:

- **≥ `sm`** — a spring slide-over from the right, `max-w-[430px]`,
  `rounded-l-[2rem]`, full height.
- **< `sm`** — a bottom sheet, `max-h-[86svh]`, `rounded-t-[2rem]`, with a drag
  handle you can flick to dismiss (`useDragControls`, dismiss on
  `offset.y > 90 || velocity.y > 500`).

`RULE` `86svh`, not `86vh` — the small-viewport unit, so mobile browser chrome
cannot push the sheet's footer off-screen. Same reasoning behind
`env(safe-area-inset-bottom)` padding on fixed bottom elements.

Behaviour checklist for the overlay (all required):
- pause the smooth-scroll instance and set `documentElement.style.overflow = "hidden"`
- move focus in on open; trap `Tab` (wrap first ↔ last); close on `Escape`
- restore focus to the trigger on close
- close on route change
- close when crossing to the desktop layout — CSS may hide the overlay while
  `open` stays `true`, leaving the scroll lock and focus trap attached to a
  dialog nobody can see (an iPad rotating portrait→landscape crosses this)

### 11.3 The floating pill

When the plan is non-empty, a frosted pill fixed at bottom centre: icon with a
count badge, hairline divider, subtotal, label. The only persistent commerce
chrome on the page.

### 11.4 Translation table

| Shop component | Clinic component | Carries over unchanged |
|---|---|---|
| Add-to-cart morph | Add-to-plan / session count | Fixed slot, `aria-live`, spring morph |
| Cart drawer / bottom sheet | Booking drawer: treatment → clinician → slot | Focus trap, Escape, scroll lock, drag-dismiss, `svh` |
| Floating cart pill + subtotal | Floating "your appointment" pill + running estimate | Glass, badge, safe-area inset |
| Bundle card with savings | Treatment package with savings | Ribbon, dashed rule, struck sum, save pill |
| Checkout success | Booking confirmed + reference number | Circle-check spring, reference in a hairline pill |
| Scarcity ping dot | "2 slots left this week" — **see §14** | The dot, the ping, the micro-label |
| Trust chips (shipping/payment/packing) | Trust chips (registration/insurance/sedation) | Frosted pill, 15px line icon, `.16em` tracking |
| Wine catalogue (anti-card) | Treatment list (anti-card) | Hairlines, stretched link, numbered marks |
| Two-soul label pair | Two clinicians / practice + lab | Dark card + light card, gold ampersand, dim-the-other-on-hover |

---

## 12. Page composition formula

Every content section is assembled from the same stack, bottom to top:

```
6  Content            — a Stagger grid of cards, or the hairline listing
5  SectionTitle       — eyebrow + serif headline (one italic accent) + description
4  GhostWord          — bleeding off one edge, 5–7%
3  LineArt            — at the section's bottom edge (some sections)
2  Atmosphere         — one named variant: calm / warm / clinical / dusk
1  <section class="relative overflow-hidden">
```

```jsx
<section id="treatments" className="relative scroll-mt-28 overflow-hidden">
  <Atmosphere variant="clinical" />
  <GhostWord className="left-[-2vw] top-10 text-[12vw]">Restauro</GhostWord>
  <div className="relative mx-auto max-w-content px-6 py-24 lg:px-10">
    <SectionTitle align="left" eyebrow="Il nostro lavoro" description="…">
      Treatments <span className="italic text-[--c-brand]">and prices</span>
    </SectionTitle>
    <div className="mt-12">{/* … */}</div>
  </div>
</section>
```

`RULE` One column: `max-width: 1200px`, `padding-inline: 1.5rem` (`2.5rem` at
`lg`). Section padding is always `py-24`. Nothing bespoke.

`RULE` `scroll-mt-28` on any section that is an in-page anchor target, so the
fixed header does not cover its heading.

### 12.1 Page rhythm

Wine `/shop`:
hero → USP strip → packages (3 cards) → catalogue (anti-card) → brand story
(2-col + label pair) → emotional section (parallax photo + checklist) → service
(3 cards) → **dark CTA band** → FAQ.

`CLINIC` Clinic homepage:
hero (a photograph of the actual practice, **not stock**) → trust strip →
treatments (anti-card list) → packages (3 cards) → meet the team (the label pair,
retargeted to two clinicians) → results gallery (parallax + dark gradient
overlay) → your first visit (3 cards) → **dark CTA band** → FAQ.

`RULE` **Exactly one dark CTA band per page**, near the end: a full-bleed
shader in the deep palette under a `.glass-brand` pane, paper serif headline with
one metallic italic accent, `light` and `glass` buttons. Its scarcity is what
makes it land.

`RULE` Numbered markers (`01 / 02 / 03`) only where the content genuinely is a
sequence. "Your first visit" qualifies. Treatments and packages do not — they are
a set, not steps.

---

## 13. Guardrails

These are the parts that were learned the hard way. Implement them before any
effect.

### 13.1 Reduced motion, at three levels

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
  /* scroll reveals: visible immediately, without JS */
  [data-reveal] {
    opacity: 1 !important;
    filter: none !important;
    transform: none !important;
  }
}
```

Plus `<MotionConfig reducedMotion="user">` at the root, plus per-component
bail-outs. The smooth-scroll library never initialises at all.

`RULE` **Reduced-motion handling must live in CSS, not in a React render
branch.** This is the single most important implementation note in this
document.

> Branching on `matchMedia` at render time makes the client produce a different
> tree than the server. React **does not remove** server-rendered attributes on
> a hydration mismatch — it only warns (`Extra attributes from the server:
> style`). The server-rendered `style="opacity:0;filter:blur(8px)"` therefore
> sticks, and half the page stays permanently invisible for exactly the users
> who asked for less motion. In the original this went unnoticed for months
> because a second mismatch elsewhere aborted hydration entirely and React
> rebuilt the page client-side — one bug masking another.

The `priority` branch in §8.1 *is* safe, and the distinction matters: `priority`
is a static prop from the caller and `firstLoad` is identical on the server and
the first client render by construction. Both sides take the same branch. A
`matchMedia` branch cannot make that guarantee.

`RULE` If any content starts hidden and is revealed by JS, add a `<noscript>`
rule that unhides `[data-reveal]`.

### 13.2 Layout and scrolling

`RULE` `overflow-x: clip` on `body`, **not** `overflow-x: hidden`. `hidden`
turns the body into a scroll container, which breaks `position: sticky` on every
descendant — including pinned hero sections and sub-navigation. `clip` cuts the
same horizontal overhang without creating a scroll container. Keep `hidden`
directly above it as a fallback for engines without `clip`.

```css
body { overflow-x: hidden; overflow-x: clip; }
```

`RULE` `-webkit-tap-highlight-color: transparent` on `body`. The grey tap flash
reads as cheap; press feedback comes from the `whileTap` spring compression.

### 13.3 Touch and input

`RULE` **24×24 minimum hit area for every pointer**, expanded via pseudo-element
insets so the visible mark stays small:

```css
.dot { position: relative; height: 1rem; width: 1rem; }
.dot::before { content: ""; position: absolute; inset: -.875rem -.375rem; }
@media (min-width: 1024px) { .dot::before { inset: -.25rem; } }
```

WCAG 2.5.8 covers **mouse users with limited fine motor control**, not just
thumbs. The original scoped this expansion to `max-lg` and lost accessibility
points on desktop for exactly that reason. Space adjacent targets so their hit
areas touch rather than overlap (16px marks + 8px gap = 24px centres).

`RULE` Force 16px on form fields at coarse pointers — iOS zooms the page onto any
focused field under 16px:

```css
@media (hover: none) and (pointer: coarse) {
  input:not([type="checkbox"]):not([type="radio"]), select, textarea {
    font-size: 16px !important;
  }
}
```

### 13.4 Focus

```css
:focus-visible {
  outline: 2px solid var(--c-brand);
  outline-offset: 3px;
  border-radius: 4px;
  box-shadow: 0 0 0 6px rgb(246 248 248 / .60);   /* paper halo */
}
:focus:not(:focus-visible) { outline: none; }
```

The brand ring plus a paper halo stays ≥3:1 visible on both light and dark
surfaces.

### 13.5 Images

`RULE` Every image ships `width`, `height` and a real `sizes`. Without `sizes`
the browser assumes `100vw` and downloads the largest variant, defeating the
entire srcset. The original was shipping 391px-wide packshots into 64px slots —
larger in total than the hero photo.

`RULE` Derive `width`/`height` per file from a build-time manifest rather than
hard-coding an aspect ratio; assets in one set frequently differ.

### 13.6 Fonts

Self-host at build time (`next/font/google` or equivalent), wired through CSS
variables, `display: swap`. No external font requests, no FOIT, no layout shift.

`CLINIC` Two guardrails carry extra weight in healthcare:

- **Contrast.** Opacity-tinted body text at 70% sits right at the edge. Verify
  every combination at 4.5:1 rather than trusting the pattern.
- **Age profile.** A dental practice has a meaningful share of older visitors.
  The 16px body floor (§3) and 24px touch targets are hard requirements, not
  targets.

---

## 14. Do not copy

- **Ten button variants.** That set grew organically; most are unused. Ship three
  (§9.3).
- **Foreign-language watermarks for their own sake.** The Italian layer works
  because the product genuinely is Italian. Clinical Latin works for a clinic for
  the same reason. French would not.
- **The shader on every hero.** Two placements maximum (§4.4).
- **12.5px body copy.** See §3. This is the item most likely to be copied
  thoughtlessly.
- **Scarcity signals.** ⚠️ "Only 200 bottles" is charming. "Only 2 implant slots
  left" attached to a health decision is manipulative and, depending on the
  regulator, non-compliant advertising. Use the ping dot for **genuine
  availability only** — real remaining slots this week, nothing invented. This is
  a compliance issue, not a taste issue.
- **Before/after imagery without the compliance layer.** Most dental regulators
  require consent records, unretouched images, and a statement that results vary.
  The parallax-and-overlay treatment is fine; the governance around it is not
  optional.
- **The zero-shadow decision.** The original flattened `shadow-luxe` and
  `shadow-lift` to `none` while keeping the token names. That works because its
  cards are translucent over a busy ambient ground. If the clinic ground is
  calmer, put real soft shadow values back into those tokens.
- **`GoldRule` returning `null`.** In the current source this decorative
  component is a stub that renders nothing while still being called in several
  places. Do not replicate the dead call sites.

---

## 15. Implementation checklist

Order matters — each block depends on the ones above it.

**Foundation**
- [ ] Token file with the six palette roles, no pure white or black (§2.3)
- [ ] Two fonts self-hosted, wired as CSS variables (§3, §13.6)
- [ ] Type scale: two clamps, three quiet registers, `text-wrap: balance` (§3.1)
- [ ] `body { overflow-x: clip }`, tap-highlight off (§13.2)
- [ ] Focus style: brand ring + paper halo (§13.4)
- [ ] Reduced-motion block including `[data-reveal]` (§13.1)
- [ ] 16px input floor at coarse pointers (§13.3)

**Atmosphere**
- [ ] `Aura` + four named `Atmosphere` variants (§4.1)
- [ ] `.grain` utility (§4.2)
- [ ] Global `AmbientBackdrop` behind every page (§4.1)
- [ ] `GhostWord` + a vocabulary list, one word per section (§5)
- [ ] Subject line-art SVG (§4.3)

**Motion**
- [ ] `SPRING` and `EASE` constants — resist adding a third (§8)
- [ ] `Reveal` / `Stagger` / `StaggerItem` with `data-reveal` (§8.1)
- [ ] `priority` on above-the-fold content (§8.1)
- [ ] `SplitText` with U+00A0 separators and `aria-label` (§8.2)
- [ ] Lenis, desktop-only, inside the animation frame loop (§8.3)

**Surfaces**
- [ ] `.card` with two rings and a `@media (hover: hover)` guard (§6)
- [ ] `IconChip`, `Ribbon` (§6.1)
- [ ] `TiltCard` with the stationary-wrapper and touch guards (§6.2)
- [ ] `.glass`, `.glass-dark`, `.glass-brand` (§10.2)
- [ ] The anti-card listing with stretched links (§7)

**Components**
- [ ] Button: five layers, `min-height`, generated-content label copy (§9)
- [ ] Header: progress bar, glass-pill morph, sliding underline (§10.1)
- [ ] Morphing add/stepper in a fixed slot (§11.1)
- [ ] Drawer/sheet with the full overlay behaviour checklist (§11.2)
- [ ] `SectionTitle` + `Eyebrow` (§12)

**Composition**
- [ ] One 1200px column, `py-24` sections, `scroll-mt-28` on anchors (§12)
- [ ] Exactly one dark CTA band per page (§12.1)
- [ ] Numbered markers only on genuine sequences (§12.1)

**Before shipping**
- [ ] Every image has `width`, `height`, `sizes` (§13.5)
- [ ] Every hit target ≥24×24 for all pointers (§13.3)
- [ ] Body text ≥16px; all text ≥4.5:1 (§13, `CLINIC`)
- [ ] Trust chips present on mobile, not only in a desktop layer (§10.3)
- [ ] Nothing from §14 shipped
- [ ] Test with reduced motion on, with JS off, and on a touch device

---

## 16. Source map

Provenance within this repository, for anyone verifying a claim above.

| Section | Source |
|---|---|
| §2 tokens | `tailwind.config.js`, `app/globals.css` (`:root`) |
| §3 typography | `app/(site)/[locale]/layout.jsx`, `components/Deco.jsx` |
| §4 atmosphere | `components/Atmosphere.jsx`, `components/motion/ShaderGradient.jsx` |
| §4.2 grain | `app/globals.css` (`.grain`) |
| §5 watermarks | `components/Atmosphere.jsx` (`GhostWord`) |
| §6 cards | `components/shop/BundleCard.jsx`, `components/motion/TiltCard.jsx`, `components/Deco.jsx` (`IconChip`) |
| §7 anti-card | `components/shop/ShopCard.jsx`, `components/shop/ShopExplorer.jsx` |
| §8 motion | `components/motion/{Reveal,SplitText,Parallax,SmoothScroll,springs}.jsx` |
| §9 buttons | `components/ui/Button.jsx`, `BUTTON_GUIDE.md` |
| §10 chrome | `components/Header.jsx`, `app/globals.css` (`.glass*`) |
| §11 commerce | `components/shop/{AddToCart,CartDrawer,CartContext}.jsx` |
| §12 composition | `app/(site)/[locale]/shop/page.jsx`, `components/ui/ShopCtaBand.jsx` |
| §13 guardrails | `app/globals.css`, `components/WinePhotos.jsx`, `components/media/Photo.jsx`, `components/motion/SmoothScroll.jsx` |
| — general | `DESIGN.md` |

Related: a browsable version of this teardown with live specimens in the clinic
palette — https://claude.ai/code/artifact/468b0eef-cdd2-4f8e-9df0-0356c24d18e9
