import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PhotoBlock from "@/components/PhotoBlock";

const Arrow = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M5 12h14" /><path d="M13 6l6 6-6 6" />
  </svg>
);
const Grapes = (p) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M24 12c0-3 2-5 5-6-1 3 0 5 2 6" /><circle cx="19" cy="19" r="3.4" /><circle cx="26" cy="19" r="3.4" /><circle cx="33" cy="19" r="3.4" /><circle cx="22.5" cy="26" r="3.4" /><circle cx="29.5" cy="26" r="3.4" /><circle cx="26" cy="33" r="3.4" />
  </svg>
);

const HELP = [
  {
    title: "Verkostungen",
    text: "Sie möchten unsere Weine verkosten? Hier erfahren Sie, wie es geht.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-9 w-9 text-champagne" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 10c-2 6-2 9 2 11 0 4-2 12-4 14M28 10c2 6 2 9-2 11 0 4 2 12 4 14" /><path d="M9 35h10M27 35h10" /><path d="M17 21h6" />
      </svg>
    ),
  },
  {
    title: "Händleranfragen",
    text: "Sie sind Händler oder möchten unsere Weine in Ihr Sortiment aufnehmen?",
    icon: (
      <svg viewBox="0 0 48 48" className="h-9 w-9 text-champagne" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19l2-9h26l2 9z" /><path d="M11 19v19h26V19" /><path d="M20 38v-9h8v9" /><path d="M9 19h30" />
      </svg>
    ),
  },
  {
    title: "Presse & Kooperationen",
    text: "Für Presseanfragen, Kooperationen oder gemeinsame Projekte sind wir offen.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-9 w-9 text-champagne" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 18l7-2 5 4M42 18l-7-2-5 4" /><path d="M18 20c2 2.5 4 4 6 4s4-1.5 6-4" /><path d="M6 18v9l6 2M42 18v9l-6 2" />
      </svg>
    ),
  },
  {
    title: "Allgemeine Fragen",
    text: "Sie haben eine allgemeine Frage zu Maria Maria? Wir helfen Ihnen gerne weiter.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-9 w-9 text-champagne" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 11h20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H14l-6 4v-4H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" /><path d="M32 18h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2v3l-4-3h-4" />
      </svg>
    ),
  },
];

const FAQ = [
  "Wie kann ich eine Weinverkostung buchen?",
  "Bieten Sie internationalen Versand an?",
  "Kann ich Ihre Weine im lokalen Handel finden?",
];

const inputCls =
  "w-full rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-[13px] text-charcoal shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none backdrop-blur-sm transition-all duration-200 placeholder:text-charcoal/45 focus:border-champagne focus:bg-white/70 focus:ring-2 focus:ring-champagne/30";

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <Header active="Kontakt" />

      {/* ================= HERO ================= */}
      <section className="relative flex min-h-[420px] w-full items-center overflow-hidden border-b border-stone/60 md:min-h-[500px] lg:min-h-[580px]">
        <PhotoBlock variant="sunset" overlay="ivory-left" className="absolute inset-0 h-full w-full" />
        <div className="relative mx-auto w-full max-w-content px-6 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-10 py-10 lg:grid-cols-2">
            <div className="max-w-lg">
              <h1 className="font-playfair text-[2.6rem] leading-tight text-charcoal lg:text-[3.4rem]">Kontakt</h1>
              <div className="mt-4 flex items-center gap-3">
                <span className="h-px w-16 bg-champagne/70" />
                <Grapes className="h-5 w-5 text-champagne" />
                <span className="h-px w-16 bg-champagne/70" />
              </div>
              <p className="mt-5 max-w-md text-[14px] leading-relaxed text-charcoal/80">
                Wir freuen uns auf Ihre Nachricht! Ob Fragen zu unseren Weinen, Verkostungsanfragen, Partnerschaften, Händleranfragen oder besondere Momente – wir sind gerne für Sie da.
              </p>
            </div>

            {/* glass form card */}
            <div className="w-full max-w-md rounded-[28px] border border-white/60 bg-white/30 p-6 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_24px_60px_-24px_rgba(61,42,33,0.45)] backdrop-blur-2xl backdrop-saturate-150 sm:p-7 lg:justify-self-end">
              <h2 className="font-playfair text-[22px] text-charcoal">Schreiben Sie uns</h2>
              <span className="mt-2.5 block h-px w-12 bg-champagne/80" />
              <form className="mt-5 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input className={inputCls} placeholder="Ihr Name" />
                  <input className={inputCls} placeholder="E-Mail-Adresse" type="email" />
                </div>
                <input className={inputCls} placeholder="Betreff" />
                <div className="relative">
                  <select className={`${inputCls} appearance-none text-charcoal/60`} defaultValue="">
                    <option value="" disabled>Anliegen wählen</option>
                    <option>Verkostungsanfrage</option>
                    <option>Händleranfrage</option>
                    <option>Presse &amp; Kooperationen</option>
                    <option>Allgemeine Frage</option>
                  </select>
                  <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                </div>
                <textarea rows={3} className={`${inputCls} resize-none`} placeholder="Ihre Nachricht" />
                <label className="flex items-start gap-2.5 text-[11.5px] leading-snug text-charcoal/70">
                  <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-bordeaux" />
                  Ich habe die Datenschutzerklärung gelesen und stimme der Verarbeitung meiner Daten zu.
                </label>
                <button type="submit" className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-bordeaux px-6 py-3 text-[13px] tracking-wide text-ivory shadow-lg shadow-bordeaux/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-bordeaux/90 hover:shadow-xl hover:shadow-bordeaux/35 active:translate-y-0 active:scale-[0.98]">
                  Nachricht senden <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FORM + HELP ============ */}
      <section className="mx-auto max-w-content px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
          {/* contact info */}
          <div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-[13px] font-semibold tracking-wide text-charcoal">Unsere Kontaktdaten</h3>
                <div className="mt-4 space-y-3 text-[12.5px] text-charcoal/75">
                  <p className="flex items-center gap-3">
                    <svg viewBox="0 0 48 48" className="h-5 w-5 shrink-0 text-champagne" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="12" width="32" height="24" rx="2" /><path d="m8 15 16 12 16-12" /></svg>
                    info@maria-maria.wine
                  </p>
                  <p className="flex items-center gap-3">
                    <svg viewBox="0 0 48 48" className="h-5 w-5 shrink-0 text-champagne" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6h8l4 10-6 4a24 24 0 0 0 10 10l4-6 10 4v8a4 4 0 0 1-4 4A32 32 0 0 1 8 10a4 4 0 0 1 4-4z" /></svg>
                    +39 0471 123456
                  </p>
                  <p className="flex items-start gap-3">
                    <svg viewBox="0 0 48 48" className="mt-0.5 h-5 w-5 shrink-0 text-champagne" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M24 42c10-10 16-17 16-24a16 16 0 1 0-32 0c0 7 6 14 16 24z" /><circle cx="24" cy="18" r="5" /></svg>
                    <span>Maria Maria Wines<br />Südtirol, Italien</span>
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-3 text-charcoal/70">
                  <a href="#" aria-label="Instagram" className="hover:text-bordeaux"><svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" /></svg></a>
                  <a href="#" aria-label="Facebook" className="hover:text-bordeaux"><svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M13.5 21v-8h2.5l.4-3h-2.9V8.2c0-.9.3-1.5 1.6-1.5H16.5V4.1C16.2 4 15.2 4 14.1 4c-2.3 0-3.9 1.4-3.9 4v2H7.6v3h2.6v8h3.3z" /></svg></a>
                  <a href="#" aria-label="LinkedIn" className="hover:text-bordeaux"><svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M8 11v6" /><circle cx="8" cy="7.5" r="0.9" fill="currentColor" stroke="none" /><path d="M12 17v-4a2 2 0 0 1 4 0v4M12 11v6" /></svg></a>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Grapes className="h-6 w-6 text-champagne" />
                  <h3 className="text-[13px] font-semibold tracking-wide text-charcoal">Unser Versprechen</h3>
                </div>
                <p className="mt-4 text-[12.5px] leading-relaxed text-charcoal/75">
                  Wir antworten innerhalb von 1–2 Werktagen auf Ihre Anfrage. Persönlich, ehrlich und mit Leidenschaft für Wein.
                </p>
              </div>
            </div>
          </div>

          {/* help cards */}
          <div>
            <h2 className="font-playfair text-[24px] text-charcoal">Womit können wir Ihnen helfen?</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {HELP.map((h) => (
                <Link key={h.title} href="#" className="group flex flex-col items-center border border-stone/70 bg-white/40 px-5 py-7 text-center transition-colors hover:border-champagne">
                  {h.icon}
                  <h3 className="mt-4 font-playfair text-[17px] text-charcoal">{h.title}</h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-charcoal/70">{h.text}</p>
                  <Arrow className="mt-4 h-4 w-4 text-champagne group-hover:text-bordeaux" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ + SHOP ============ */}
      <section className="border-t border-stone/60 bg-[#f7f6f2]">
        <div className="mx-auto grid max-w-content grid-cols-1 gap-10 px-6 py-14 lg:grid-cols-2 lg:px-10">
          <div>
            <h2 className="font-playfair text-[22px] text-charcoal">Häufige Fragen</h2>
            <div className="mt-6 divide-y divide-stone/70 border-y border-stone/70">
              {FAQ.map((q) => (
                <button key={q} className="flex w-full items-center justify-between py-4 text-left text-[13.5px] text-charcoal hover:text-bordeaux">
                  {q}
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-charcoal/50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
                </button>
              ))}
            </div>
            <Link href="#" className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] text-bordeaux hover:underline">
              Alle FAQs ansehen <Arrow className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="relative min-h-[220px] overflow-hidden">
            <PhotoBlock variant="sunset" overlay="ivory-left" img="/img/hero.jpg" imgPos="right center" className="absolute inset-0 h-full w-full" />
            <div className="relative flex h-full flex-col justify-center px-9 py-10">
              <h3 className="font-playfair text-[22px] text-charcoal">Zum offiziellen Maria Maria Shop</h3>
              <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-charcoal/75">
                Entdecken Sie unsere Weine und bestellen Sie bequem online im offiziellen Shop.
              </p>
              <Link href="#" className="mt-5 inline-flex w-fit items-center gap-2 bg-bordeaux px-5 py-3 text-[12.5px] tracking-wide text-ivory transition-colors hover:bg-bordeaux/90">
                Zum Shop <Arrow className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
