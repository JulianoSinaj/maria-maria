"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { MailCircle, Check, Grapes } from "@/components/Icons";

/* Sidebar newsletter card — dark espresso panel with visible label,
   swaps to a champagne success state on submit (mirrors the footer). */

export default function NewsletterCard() {
  const [sent, setSent] = useState(false);

  return (
    <div className="grain relative overflow-hidden rounded-card-lg bg-espresso p-7 text-ivory shadow-luxe">
      <Grapes aria-hidden="true" className="pointer-events-none absolute -right-7 -top-7 h-36 w-36 text-ivory/[0.05]" />

      <div className="relative">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-champagne/40 bg-champagne/10 text-champagne">
          <MailCircle className="h-7 w-7" />
        </span>
        <h2 className="mt-5 font-playfair text-[21px] leading-snug">
          Bleiben Sie <span className="italic text-champagne">inspiriert</span>
        </h2>
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-ivory/70">
          Erhalten Sie regelmäßig neue Artikel, Weinwissen und exklusive Empfehlungen.
        </p>

        {sent ? (
          <p
            role="status"
            className="mt-5 flex items-start gap-2 rounded-2xl border border-champagne/40 bg-champagne/10 px-4 py-3 text-[12px] leading-snug text-champagne"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
            Danke! Bitte bestätigen Sie Ihre Anmeldung im Posteingang.
          </p>
        ) : (
          <form
            className="mt-5"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label
              htmlFor="magazin-newsletter"
              className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-ivory/60"
            >
              E-Mail-Adresse
            </label>
            <input
              id="magazin-newsletter"
              type="email"
              required
              autoComplete="email"
              placeholder="E-Mail-Adresse eingeben"
              className="mt-2 h-11 w-full rounded-full border border-ivory/15 bg-white/[0.06] px-4 text-[13px] text-ivory outline-none transition-colors duration-300 placeholder:text-ivory/40 focus:border-champagne/60"
            />
            <Button type="submit" magnetic={false} className="mt-3 w-full">
              Jetzt anmelden
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
