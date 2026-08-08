"use client";

import Button from "./Button";

export default function ButtonShowcase() {
  const variants = [
    { name: "primary", label: "Primary Wine" },
    { name: "dark", label: "Dark Charcoal" },
    { name: "outline", label: "Outline" },
    { name: "glass", label: "Glass Effect" },
    { name: "light", label: "Light Champagne" },
    { name: "premium", label: "Premium Gold ✨" },
    { name: "accent", label: "Accent Teal" },
    { name: "vibrant", label: "Vibrant Wine" },
    { name: "mint", label: "Mint Fresh" },
    { name: "earth", label: "Earth Tone" },
  ];

  const sizes = ["sm", "md", "lg"];

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-4xl font-playfair text-charcoal">Button Showcase</h1>
        <p className="mb-12 text-charcoal/60">Explore all new button variants with enhanced UI/UX</p>

        {/* All Variants */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-playfair text-charcoal">All Variants (Medium Size)</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {variants.map((v) => (
              <div key={v.name} className="rounded-lg bg-ivory p-4 shadow-md">
                <p className="mb-3 text-sm font-medium text-charcoal/70">{v.label}</p>
                <Button
                  variant={v.name}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="w-full"
                >
                  Click me
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Size Variations */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-playfair text-charcoal">Size Variations (Premium Variant)</h2>
          <div className="space-y-4">
            {sizes.map((size) => (
              <div key={size} className="flex items-center gap-4 rounded-lg bg-ivory p-4 shadow-md">
                <span className="w-16 text-sm font-medium text-charcoal/70">Size {size}:</span>
                <Button
                  variant="premium"
                  size={size}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Explore
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Icon Variations */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-playfair text-charcoal">Icon Styles</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-ivory p-4 shadow-md">
              <p className="mb-3 text-sm font-medium text-charcoal/70">Arrow (default)</p>
              <Button
                variant="accent"
                iconType="arrow"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Button
              </Button>
            </div>
            <div className="rounded-lg bg-ivory p-4 shadow-md">
              <p className="mb-3 text-sm font-medium text-charcoal/70">Arrow Up-Right</p>
              <Button
                variant="accent"
                iconType="up-right"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Button
              </Button>
            </div>
            <div className="rounded-lg bg-ivory p-4 shadow-md">
              <p className="mb-3 text-sm font-medium text-charcoal/70">No Icon</p>
              <Button
                variant="accent"
                iconType="none"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Button
              </Button>
            </div>
          </div>
        </section>

        {/* Background Contrast Demo */}
        <section>
          <h2 className="mb-6 text-2xl font-playfair text-charcoal">Contrast on Dark Backgrounds</h2>
          <div className="rounded-lg bg-charcoal p-8">
            <div className="mb-4 text-ivory/60">Try light variants on dark backgrounds:</div>
            <div className="flex flex-wrap gap-4">
              <Button variant="light" href="#" onClick={(e) => e.preventDefault()}>
                Light
              </Button>
              <Button variant="premium" href="#" onClick={(e) => e.preventDefault()}>
                Premium
              </Button>
              <Button variant="accent" href="#" onClick={(e) => e.preventDefault()}>
                Accent
              </Button>
              <Button variant="mint" href="#" onClick={(e) => e.preventDefault()}>
                Mint
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
