"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { MailCircle, Check } from "@/components/Icons";

/* Newsletter-Karte für die Kontaktseite — helle Karte im Stil der Hilfe-Cards,
   Pill-Formular wie im Footer, wechselt nach dem Absenden in einen
   Champagner-Erfolgszustand. */

export default function NewsletterSignup({ className = "" }) {
  const [sent, setSent] = useState(false);

  return (
    <div
      className={`ring-hairline rounded-card-lg border border-stone/40 bg-white/70 p-7 shadow-luxe sm:p-8 ${className}`}
    >
      <div className="flex items-start gap-4">
        <span className="ring-hairline flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cream to-champagne-light/40 text-bordeaux shadow-chip">
          <MailCircle className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-playfair text-[20px] leading-snug text-charcoal">
            Bleiben Sie auf dem Laufenden
          </h3>
          <p className="mt-2 text-[12.5px] leading-relaxed text-charcoal/70">
            Erhalten Sie Neuigkeiten, exklusive Angebote und Geschichten aus Italien.
          </p>
        </div>
      </div>

      {sent ? (
        <p
          role="status"
          className="mt-5 flex items-start gap-2 rounded-2xl border border-champagne/70 bg-champagne/15 px-4 py-3 text-[12px] leading-snug text-bordeaux"
        >
          <Check className="mt-0.5 h-4 w-4 shrink-0" />
          Danke! Bitte bestätigen Sie Ihre Anmeldung im Posteingang.
        </p>
      ) : (
        <form
          className="mt-5 flex items-center gap-1.5 rounded-full border border-charcoal/15 bg-white/70 p-1.5 transition-colors duration-300 focus-within:border-champagne"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <label htmlFor="kontakt-newsletter" className="sr-only">
            E-Mail-Adresse
          </label>
          <input
            id="kontakt-newsletter"
            type="email"
            required
            autoComplete="email"
            placeholder="E-Mail-Adresse eingeben"
            className="h-11 min-w-0 flex-1 bg-transparent px-4 text-[13px] text-charcoal outline-none placeholder:text-charcoal/40"
          />
          <Button type="submit" size="sm" magnetic={false} className="shrink-0">
            Anmelden
          </Button>
        </form>
      )}
    </div>
  );
}
