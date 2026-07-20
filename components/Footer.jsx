import Link from "next/link";
import Logo, { Stemma } from "./Logo";
import { Instagram, Facebook, Mail } from "./Icons";

export default function Footer() {
  return (
    <footer className="border-t border-stone bg-[#eee8db]">
      <div className="mx-auto max-w-content px-6 py-14 lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="grid flex-1 grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* brand */}
            <div>
              <Logo className="w-[92px]" />
              <p className="mt-4 max-w-[220px] text-[12px] leading-relaxed text-charcoal/70">
                Italienische Boutique-Weine für bewusst gewählte Genussmomente.
              </p>
              <div className="mt-5 flex items-center gap-3 text-charcoal/70">
                <a href="#" aria-label="Instagram" className="hover:text-bordeaux"><Instagram className="h-5 w-5" /></a>
                <a href="#" aria-label="Facebook" className="hover:text-bordeaux"><Facebook className="h-5 w-5" /></a>
                <a href="#" aria-label="E-Mail" className="hover:text-bordeaux"><Mail className="h-5 w-5" /></a>
              </div>
            </div>
            {/* kontakt */}
            <div>
              <h4 className="text-[13px] font-semibold tracking-wide">Kontakt</h4>
              <div className="mt-4 space-y-0.5 text-[12px] leading-relaxed text-charcoal/70">
                <p>Maria Maria Wines</p>
                <p>Via del Vino 12</p>
                <p>39052 Caldaro (BZ), Italien</p>
                <p>info@maria-maria.wine</p>
                <p>+39 0471 123456</p>
              </div>
            </div>
            {/* newsletter */}
            <div>
              <h4 className="text-[13px] font-semibold tracking-wide">Newsletter</h4>
              <p className="mt-4 text-[12px] leading-relaxed text-charcoal/70">
                Erhalten Sie Neuigkeiten, exklusive Angebote und Geschichten aus Italien.
              </p>
              <div className="mt-4 flex max-w-[260px]">
                <input className="flex-1 border border-stone bg-ivory px-3 py-2 text-[12px] outline-none focus:border-champagne" placeholder="E-Mail-Adresse eingeben" />
                <button className="bg-charcoal px-3 text-ivory" aria-label="Anmelden">→</button>
              </div>
            </div>
            {/* shop */}
            <div>
              <h4 className="text-[13px] font-semibold tracking-wide">Zum offiziellen Shop</h4>
              <p className="mt-4 max-w-[200px] text-[12px] leading-relaxed text-charcoal/70">
                Entdecken und bestellen Sie unsere Weine direkt im Maria Maria Shop.
              </p>
              <Link href="#" className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-bordeaux hover:underline">
                Zum Shop →
              </Link>
            </div>
          </div>
          {/* crest */}
          <div className="hidden shrink-0 lg:block">
            <Stemma className="w-[92px] opacity-70 grayscale" />
          </div>
        </div>
      </div>

      <div className="border-t border-stone/70">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-x-4 gap-y-1 px-6 py-4 text-[11px] text-charcoal/60 lg:px-10">
          <span>© 2024 Maria Maria Wines</span>
          <span className="text-stone">|</span>
          <a href="#" className="hover:text-bordeaux">Datenschutz</a>
          <span className="text-stone">|</span>
          <a href="#" className="hover:text-bordeaux">Impressum</a>
          <span className="text-stone">|</span>
          <a href="#" className="hover:text-bordeaux">AGB</a>
        </div>
      </div>
    </footer>
  );
}
