"use client";
import { pushEvent, pageLanguage, CLICK_EMAIL } from "@/lib/analytics";

/* Der mailto-Link der Hero-Kontaktzeile — direkter Kontakt an der
   Formularlogik vorbei (Handoff §16, click_email). Als eigene, winzige
   Client-Komponente, damit die Kontaktzeilen selbst Server-Markup bleiben:
   nur der onClick braucht den Browser. Die Adresse geht NICHT in den
   dataLayer — nur Ort und Sprache. */

export default function EmailLink({ email, location = "hero", className = "" }) {
  return (
    <a
      href={`mailto:${email}`}
      className={className}
      onClick={() => pushEvent(CLICK_EMAIL, { location, language: pageLanguage() })}
    >
      {email}
    </a>
  );
}
