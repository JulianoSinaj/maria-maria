# 🎨 Enhanced Button Component Guide

Your button component now features **10 vibrant variants** with sophisticated micro-interactions and improved UI/UX.

## Available Variants

### Primary Actions (Prominent)
- **`primary`** - Deep wine gradient (Bordeaux → Wine)
  - Use for: Main CTAs, hero section buttons
  - Best for: High-priority conversions
  
- **`vibrant`** - Deep wine with layered depth (Wine → Bordeaux → Deep)
  - Use for: Bold, attention-grabbing CTAs
  - Best for: Premium offers, exclusive actions

### Secondary & Neutral
- **`light`** - Soft champagne gradient (Champagne Light → Ivory)
  - Use for: Secondary actions, less prominent buttons
  - Best for: Neutral contexts, clean layouts
  
- **`dark`** - Charcoal with bordeaux fill
  - Use for: Minimalist design, high contrast
  - Best for: Dark-themed sections

### Accent & Specialty
- **`premium`** - Gold/champagne gradient (Champagne → Champagne Light → Straw)
  - Use for: Luxury feel, premium features, exclusive content
  - Best for: Wine products, high-end CTAs
  
- **`accent`** - Teal/acqua gradient (Acqua → Acqua Deep)
  - Use for: Complementary actions, fresh/modern feel
  - Best for: Secondary CTAs with color contrast
  
- **`mint`** - Light aqua gradient (Acqua Light → Acqua)
  - Use for: Friendly, approachable actions
  - Best for: Sign-ups, friendly CTAs

### Thematic
- **`earth`** - Forest green to dark brown (Vine → Espresso)
  - Use for: Grounded, natural feel
  - Best for: Wine/vineyard themed sections
  
- **`outline`** - Minimal outline with charcoal
  - Use for: Minimal, clean designs
  - Best for: Text-heavy layouts
  
- **`glass`** - Frosted glass with transparent shine
  - Use for: Modern, sophisticated feel
  - Best for: Overlay buttons, premium contexts

## Usage Examples

### Basic Button
```jsx
<Button variant="primary" href="/shop">
  Explore Wines
</Button>
```

### With Icon Variants
```jsx
// Arrow icon (default)
<Button variant="accent" iconType="arrow">
  Learn More
</Button>

// Up-right arrow
<Button variant="premium" iconType="up-right">
  Open External
</Button>

// No icon
<Button variant="light" iconType="none">
  Continue
</Button>
```

### Size Options
```jsx
<Button size="sm">Small Button</Button>        {/* 40px */}
<Button size="md">Medium Button</Button>       {/* 44px (default) */}
<Button size="lg">Large Button</Button>        {/* 52px */}
```

### External Links
```jsx
<Button 
  variant="premium" 
  href="https://example.com" 
  external
>
  Visit External
</Button>
```

### Button Elements (No Link)
```jsx
<Button 
  variant="accent" 
  onClick={handleSubmit}
  type="submit"
>
  Submit Form
</Button>
```

## Animations & Micro-Interactions

Each button features layered, hardware-accelerated animations:

1. **Rising Fill** - Colored fill rises from bottom on hover
2. **Shimmer Sweep** - Light sweep across button surface
3. **Glow Effect** - Subtle radial glow on hover
4. **Label Roll** - Text rolls up revealing secondary text
5. **Icon Motion** - Arrow moves directionally on hover
6. **Press Compression** - Scale 0.96 on click (spring physics)

✨ All animations use `transform` and `opacity` only — **zero layout shift**

## Color Palette Reference

```
Reds:        Bordeaux (#6B0F1A), Wine (#8A2B2F), Bordeaux-Deep (#43090F)
Golds:       Champagne (#C8B77A), Champagne-Light (#E3D9B8), Straw (#E8DC9A)
Teals:       Acqua (#45B3A2), Acqua-Deep (#23786B), Acqua-Light (#C9E8E1)
Neutrals:    Charcoal (#1B1B1B), Ivory (#F7F4EF), Cream (#FBF9F4)
Accents:     Vine (#55683F), Espresso (#211511)
```

## Recommendation by Use Case

| Use Case | Variant | Reason |
|----------|---------|--------|
| Shop CTA | `primary` | Builds urgency with wine tones |
| "Learn More" | `accent` | Fresh, inviting, color contrast |
| Premium Feature | `premium` | Luxury aesthetic matches product |
| Secondary Action | `light` | Neutral, doesn't distract |
| Newsletter Signup | `mint` | Friendly, approachable feel |
| Vineyard Section | `earth` | Thematic, grounded connection |
| Hero Overlay | `glass` | Modern, sophisticated |

## Hover State Preview

All variants smoothly transition through:
- Color fill rising from bottom (duration: 500ms)
- Enhanced shine sweep (duration: 900ms)
- Glow effect fading in (duration: 500ms)
- Label rolling up with new text (duration: 500ms)
- Icon moving in direction of arrow type

---

**Pro Tip:** For maximum visual impact on important CTAs, pair `premium` or `vibrant` with a prominent page position. Use `light` and `glass` for secondary actions to create visual hierarchy.
