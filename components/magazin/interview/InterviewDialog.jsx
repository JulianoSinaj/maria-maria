"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "motion/react";
import Logo from "@/components/Logo";
import { Close } from "@/components/Icons";
import { useLenis } from "@/components/motion/SmoothScroll";

/* Das Lesefenster — der Artikel, ohne das Magazin zu verlassen.

   Wichtig zum Verständnis: Dieses Fenster ist eine ZUGABE, kein Träger. Der
   Artikel existiert als echte Seite unter /magazin/interviews/<slug>; die
   Karte im Magazin verlinkt sie ganz normal. Erst wenn Next.js diesen Klick
   client-seitig abfängt (Intercepting Route, siehe
   app/(site)/[locale]/@modal/…), erscheint stattdessen dieses Fenster — mit
   derselben URL in der Adresszeile. Ohne JavaScript, bei einem Fehler, per
   Direktlink, aus einer Suchmaschine oder aus einer geteilten Nachricht
   landet man immer auf der vollen Seite. Genau das verlangt der Handoff
   (Seiten 2 und 8) als Pflicht-Fallback.

   Unter 1024 px gibt es bewusst kein Fenster: Ein Dialog mit eigenem Scroll
   in einer scrollenden Seite erzeugt auf dem Telefon den doppelten Scroll,
   den die QA-Liste (Seite 22) ausdrücklich ausschließt. Dort ersetzt ein
   `location.replace` den abgefangenen Zustand durch die echte Seite — eine
   Adresse, ein Verlaufseintrag, kein Fenster im Fenster.

   Zugänglichkeit (Handoff Seite 21):
   - role="dialog" + aria-modal, benannt über die H1 des Artikels
   - Fokus startet auf dem Schließen-Knopf, Tab bleibt im Fenster gefangen
   - Escape schließt, der Fokus kehrt auf die Karte zurück
   - der Hintergrund wird `inert` und ist weder klickbar noch tabbar
   - prefers-reduced-motion: kein Einblenden, kein Skalieren */

const CLOSE_DELAY = 180;

export default function InterviewDialog({ children, slug, ui = {}, labelledBy }) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const fallbackId = useId();
  const titleId = labelledBy ?? fallbackId;

  const scrollerRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  /* --- Unter 1024 px: gar kein Fenster, sondern die echte Seite --------- */
  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      /* replace statt assign: Der abgefangene Zustand soll keinen eigenen
         Eintrag im Verlauf hinterlassen — sonst führte „Zurück" vom Artikel
         wieder auf den Artikel. */
      window.location.replace(window.location.href);
      return;
    }
    setMounted(true);
  }, []);

  /* --- Öffnen und Schließen -------------------------------------------- */
  const close = useCallback(() => {
    setVisible(false);
    /* Erst ausblenden, dann zurücknavigieren — sonst verschwindet das
       Fenster hart, während die Seite darunter schon wieder da ist. */
    window.setTimeout(() => router.back(), reduced ? 0 : CLOSE_DELAY);
  }, [router, reduced]);

  useEffect(() => {
    if (!mounted) return;

    const opener = document.querySelector(`[data-interview-card="${slug}"]`);
    const body = document.body;
    const previousOverflow = body.style.overflow;

    /* Lenis hält sonst die Seite darunter weiter am Rollen, während im
       Fenster gescrollt wird. */
    lenis?.current?.stop();
    body.style.overflow = "hidden";

    /* Hintergrund stilllegen: alles außer dem Portal selbst. `inert` nimmt
       den Teilbaum aus Tab-Reihenfolge, Klick und Screenreader in einem
       Zug — genau das, was der Handoff mit „background: inert" meint. */
    const inerted = [];
    for (const child of Array.from(body.children)) {
      if (child.dataset?.interviewDialog === "") continue;
      if (!child.hasAttribute("inert")) {
        child.setAttribute("inert", "");
        inerted.push(child);
      }
    }

    setVisible(true);

    /* Fokus auf den Schließen-Knopf: Er ist die einzige Aktion, die man in
       einem Lesefenster sofort braucht — und ein Fokus auf der Überschrift
       ließe manche Screenreader die H1 zweimal ansagen.

       Zweimal, nicht einmal: Next setzt nach einer Navigation selbst den
       Fokus (ScrollAndFocusHandler) und tut das NACH dem ersten
       requestAnimationFrame — der erste Versuch landete deshalb messbar
       wieder auf <body>. Der zweite Anlauf greift nur, wenn der Fokus
       tatsächlich verloren ging; wer in der Zwischenzeit selbst geklickt
       oder getabbt hat, wird nicht herumgerissen. */
    const focusClose = () => closeRef.current?.focus();
    window.requestAnimationFrame(focusClose);
    const refocus = window.setTimeout(() => {
      if (document.activeElement === document.body) focusClose();
    }, 120);

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      /* Fokusfalle. Die Liste wird bei jedem Tab neu gelesen, weil der
         Artikel Bilder nachlädt und dabei Links dazukommen können. */
      const focusables = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(refocus);
      document.removeEventListener("keydown", onKeyDown);
      inerted.forEach((el) => el.removeAttribute("inert"));
      body.style.overflow = previousOverflow;
      lenis?.current?.start();
      /* Fokus zurück auf die Karte, die das Fenster geöffnet hat. */
      opener?.focus?.();
    };
  }, [mounted, slug, close, lenis]);

  /* --- Lesefortschritt -------------------------------------------------- */
  const onScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 0);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      data-interview-dialog=""
      className="fixed inset-0 z-[120] flex items-center justify-center p-6"
    >
      {/* Hintergrund — Klick daneben schließt, wie eine zugeklappte Seite.
          Bewusst ein <div> und kein <button>: Als Knopf stünde eine
          bildschirmfüllende Fläche als erstes Element in der Tab-Reihenfolge
          und würde Screenreadern als zweites „Gespräch schließen" gemeldet.
          Für Tastatur und Vorlesesoftware gibt es Escape und den echten
          Schließen-Knopf oben rechts. */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`absolute inset-0 bg-espresso/45 backdrop-blur-[2px] transition-opacity duration-300 ${
          visible || reduced ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative flex max-h-[90vh] w-[90vw] max-w-[1280px] flex-col overflow-hidden rounded-card-lg bg-ivory transition-[opacity,transform] duration-300 ease-out-expo ${
          visible || reduced ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        {/* ---- Kopfleiste: Logo, Lesefortschritt, Schließen ---- */}
        <div className="relative flex shrink-0 items-center gap-6 border-b border-champagne/35 bg-cream/80 px-6 py-3">
          {/* <Logo> ist breitengesteuert (h-auto steckt in der Komponente) —
              deshalb hier eine Breite, keine Höhe. */}
          <Logo className="w-[88px] shrink-0" />

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal/45 sm:inline">
              {ui.readingProgress}
            </span>
            {/* Reine Anzeige — deshalb aria-hidden und daneben der Wert als
                Text, den auch ein Screenreader ausgeben kann. */}
            <span aria-hidden="true" className="h-[3px] flex-1 overflow-hidden rounded-full bg-charcoal/10">
              <span
                className="block h-full rounded-full bg-bordeaux transition-[width] duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </span>
            <span className="w-10 shrink-0 text-right text-[11px] tabular-nums text-charcoal/50">
              {progress}%
            </span>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={ui.close}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone/60 bg-white/70 text-charcoal transition-colors duration-300 hover:border-bordeaux hover:text-bordeaux focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordeaux"
          >
            <Close aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        {/* ---- Der Artikel, unverändert ----
            data-lenis-prevent: der Seiten-Scroll darf diesen Bereich nicht
            übernehmen, sonst scrollt das Fenster mit fremder Trägheit. */}
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          data-lenis-prevent
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
