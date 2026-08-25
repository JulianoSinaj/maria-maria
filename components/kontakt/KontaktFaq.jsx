"use client";
import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Link from "@/components/i18n/LocaleLink";
import { Arrow } from "@/components/Icons";
import { useLenis } from "@/components/motion/SmoothScroll";
import {
  pushEvent,
  pageLocation,
  FAQ_OPEN,
  FAQ_CTA_CLICK,
} from "@/lib/analytics";
import { CTA_LINK, FOCUS_RING } from "./styles";

/* Akkordeon der Kontakt-FAQ.

   Handoff §10: „La risposta deve essere presente nell'HTML iniziale, non
   caricata solo al click." Deshalb steht jede Antwort im Markup und wird
   beim Öffnen nur in der Höhe entfaltet — kein Fetch, kein Unmount.

   Im Mockup stehen vier Fragen und darunter „Alle Fragen ansehen". Der
   Schalter blendet die übrigen ein, statt auf eine zweite Seite zu führen,
   die es nicht gibt. Auch sie stehen von Anfang an im HTML; bis zum Klick
   sind sie nur nicht sichtbar.

   Eine Frage offen zur Zeit: zwei aufgeklappte Antworten schieben die dritte
   aus dem Bild, und der Nutzer scrollt hinter seiner eigenen Frage her.

   ZWEI DINGE, die dieses Akkordeon mit dem der übrigen Seiten teilt
   (components/faq/FaqSection.jsx) und die hier zunächst fehlten:

   1. Höchstens EIN weiterführender Link je Antwort (`item.link`), mit
      beschreibendem Anchor-Text. Die Kontaktseite war bis dahin eine
      Sackgasse: Sie empfängt Verweise aus der Kopfzeile, der Fußzeile und
      der Startseiten-FAQ, gab aber selbst keinen einzigen weiter — weder auf
      die Kollektion noch auf die Regionen, obwohl vier ihrer Antworten genau
      davon sprechen. Der Link steht unter der Antwort statt im Satz: Er
      lässt den freigegebenen Text unangetastet und ist beim Überfliegen als
      Weg erkennbar.

   2. Ein Anker je Frage (`id={item.id}`), damit /kontakt#kontakt-sortiment
      die richtige Antwort aufschlägt. Die Startseiten-FAQ verlinkt seit dem
      Relaunch genau so hierher; ohne Anker landete der Besucher stumm am
      Seitenanfang. Liegt die Frage hinter „Alle Fragen ansehen", klappt der
      Deep-Link den Rest zuerst auf. */

const VISIBLE = 4;

function Row({ item, open, onToggle, uid, reduced }) {
  const panelId = `${uid}-panel-${item.id}`;
  const buttonId = `${uid}-button-${item.id}`;

  return (
    /* scroll-mt-24 wie die Formularsektion: Ohne den Abstand schiebt die
       Kopfzeile die angesprungene Frage unter sich. */
    <div id={item.id} className="scroll-mt-24 border-b border-stone/60 last:border-b-0">
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className={`group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-300 hover:bg-champagne-light/15 sm:px-6 ${FOCUS_RING}`}
        >
          <span
            className={`text-[16px] font-medium leading-snug transition-colors duration-300 sm:text-[17px] ${
              open ? "text-bordeaux" : "text-charcoal"
            }`}
          >
            {item.q}
          </span>
          {/* + geschlossen, – geöffnet — dieselbe Bauform wie in
              components/faq/FaqSection.jsx: der senkrechte Balken fährt auf
              der GPU über scaleY ein statt zu rotieren. */}
          <span
            aria-hidden="true"
            className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
              open
                ? "border-champagne bg-champagne-light/30 text-bordeaux"
                : "border-stone/80 text-charcoal/55 group-hover:border-champagne"
            }`}
          >
            <span className="absolute h-[1.5px] w-4 rounded-full bg-current" />
            <span
              className={`absolute h-4 w-[1.5px] origin-center rounded-full bg-current will-change-transform ${
                reduced ? "" : "transition-transform duration-500 ease-out-expo"
              } ${open ? "scale-y-0" : "scale-y-100"}`}
            />
          </span>
        </button>
      </h3>

      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 pr-10 sm:px-6 sm:pb-6">
          <p className="text-[14px] leading-relaxed text-charcoal/70">{item.a}</p>

          {/* `tabIndex` folgt dem Öffnungszustand: Das Panel bleibt im DOM
              (die Antwort soll im HTML stehen), ist geschlossen aber nur auf
              Höhe 0 gefaltet — ein Link darin wäre sonst mit der Tabulator-
              taste erreichbar, ohne dass irgendwo etwas zu sehen ist. */}
          {item.link && (
            <Link
              href={item.link.href}
              tabIndex={open ? 0 : -1}
              onClick={() =>
                pushEvent(FAQ_CTA_CLICK, {
                  cta_text: item.link.label,
                  cta_destination: item.link.href,
                  cta_position: "kontakt_faq",
                  page_type: "kontakt",
                })
              }
              className={`${CTA_LINK} mt-3.5 min-h-[44px] ${FOCUS_RING}`}
            >
              {item.link.label}
              <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover/link:translate-x-1" />
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function KontaktFaq({ copy }) {
  const uid = useId().replace(/:/g, "");
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const [open, setOpen] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const items = copy.items ?? [];
  const head = items.slice(0, VISIBLE);
  const tail = items.slice(VISIBLE);

  /* Deep-Link: /kontakt#kontakt-sortiment schlägt die Frage auf und springt
     sie an. Die Startseiten-FAQ verlinkt genau so hierher.

     BEWUSST IN ZWEI SCHRITTEN, mit `pending` als Staffelstab dazwischen.
     Liegt die Frage hinter „Alle Fragen ansehen", muss der hintere Block
     erst sichtbar sein, bevor irgendwer ihn anspringen kann: Ein `hidden`
     Element hat keine Geometrie, `getBoundingClientRect()` liefert Nullen,
     und Lenis bekäme die Position 0 gemeldet — der Besucher bliebe am
     Seitenanfang stehen.

     Die naheliegende Abhilfe wäre ein requestAnimationFrame (oder zwei) nach
     `setExpanded`. Sie wäre eine Wette darauf, wann React den Commit
     einspielt. Der zweite Effekt unten dagegen KANN gar nicht zu früh
     laufen: `pending` wird erst in dem Render wahr, in dem `expanded` schon
     gilt — React garantiert die Reihenfolge, kein Timing nötig.

     Nur beim Montieren: Ein späterer Hash-Wechsel stammt vom Besucher selbst
     und soll das offene Panel nicht unter ihm wegschalten. */
  const [pending, setPending] = useState(null);

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash) return;

    const index = items.findIndex((item) => item.id === hash);
    if (index === -1) return;

    if (index >= VISIBLE) setExpanded(true);
    setPending(hash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pending) return;
    setOpen(pending);
    setPending(null);

    const target = document.getElementById(pending);
    if (!target) return;

    /* `scrollTo` von Lenis statt scrollIntoView, aus demselben Grund wie in
       IntentContext: Die Storefront hat das Wurzel-Scrolling an Lenis
       abgegeben, natives Smooth-Scrolling ist per CSS abgeschaltet und würde
       hart springen. Ohne Lenis (Reduced Motion, noch nicht montiert) ist der
       harte Sprung genau das, was ein Anker sonst auch tut — richtig, nur
       unhübsch. */
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const instance = lenis?.current;

    if (instance && !isReduced) {
      instance.scrollTo(target, { offset: -96, duration: 1.1 });
    } else {
      target.scrollIntoView({ behavior: isReduced ? "auto" : "smooth", block: "start" });
    }
  }, [pending, lenis]);

  /* `position` ist die 1-basierte Stelle in der Gesamtliste — die Nutzlast
     von faq_open (Homepage-FAQ-Guide), mit der sich auswerten lässt, ob die
     Fragen hinter „Alle Fragen ansehen" überhaupt noch geöffnet werden. */
  const toggle = (item, position) => {
    /* Nicht im setOpen-Updater: Updater müssen rein bleiben (StrictMode
       ruft sie doppelt), das Event würde sonst im Dev-Modus zweimal feuern. */
    const willOpen = open !== item.id;
    setOpen(willOpen ? item.id : null);
    if (willOpen) {
      pushEvent(FAQ_OPEN, {
        faq_id: item.id,
        faq_question: item.q,
        page_location: pageLocation(),
        page_type: "kontakt",
        position,
      });
    }
  };

  const row = (item, position) => (
    <Row
      key={item.id}
      item={item}
      uid={uid}
      reduced={reduced}
      open={open === item.id}
      onToggle={() => toggle(item, position)}
    />
  );

  return (
    <div>
      <div className="overflow-hidden rounded-card border border-stone/60 bg-white/70">
        {head.map((item, i) => row(item, i + 1))}

        {/* Die restlichen Fragen stehen im HTML und sind bis zum Klick nur
            nicht sichtbar — `hidden` nimmt sie sauber aus Tastaturreihenfolge
            und Screenreader, ohne sie dem Crawler vorzuenthalten. */}
        {tail.length > 0 && (
          <div hidden={!expanded} className="border-t border-stone/60 first:border-t-0">
            {tail.map((item, i) => row(item, VISIBLE + i + 1))}
          </div>
        )}
      </div>

      {tail.length > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={`${CTA_LINK} mt-4 min-h-[44px] ${FOCUS_RING}`}
        >
          {expanded ? copy.less : copy.more}
          <Arrow
            className={`h-3.5 w-3.5 transition-transform duration-500 ease-out-expo ${
              expanded ? "-rotate-90" : "group-hover/link:translate-x-1"
            }`}
          />
        </button>
      )}
    </div>
  );
}
