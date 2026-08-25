import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { BUSINESS } from "@/lib/site";

/* Kontakt-Endpoint — nimmt das Anfrageformular entgegen, validiert
   serverseitig und leitet die Anfrage an einen konfigurierbaren Kanal weiter:
   1. CONTACT_WEBHOOK_URL  — beliebiger Webhook (Zapier/Make/Slack/CRM), erhält JSON
   2. RESEND_API_KEY + CONTACT_TO_EMAIL — Versand als E-Mail über Resend
   3. SMTP_HOST + SMTP_USER + SMTP_PASSWORD — Versand über ein bestehendes
      Postfach (hier: Strato), siehe die Begründung bei deliver()
   Ohne Konfiguration wird die Anfrage im Server-Log festgehalten, damit im
   Staging nichts verloren geht.

   Die Nutzlast folgt dem Kontakt-Handoff vom 18.08.2026: ein stabiles
   `intent` (gastronomie_feinkost, event_feier …), die fünf Basisangaben und
   eine Liste `details` mit den Zusatzfeldern, die zum gewählten Anliegen
   gehören. Die Liste kommt fertig beschriftet aus dem Formular — das Team
   liest die Mail, und „8" ohne „Anzahl der Personen" davor sagt nichts.

   Serverseitig wird trotzdem alles neu geprüft: Ein Client, der Felder
   mitschickt, die es im Formular nicht gibt, ist genau der Fall, für den
   diese Funktion existiert. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Stabile Anliegen-Werte — dieselbe Liste wie components/kontakt/intents.js.
   Bewusst dupliziert statt importiert: Die Route darf keinen Wert
   akzeptieren, nur weil ihn ein Client-Modul kennt. */
const INTENTS = new Set([
  "gastronomie_feinkost",
  "handel_wiederverkauf",
  "event_feier",
  "verkostung",
  "individuelle_auswahl",
  "sonstiges",
]);

const MAX = {
  name: 120,
  email: 200,
  company: 160,
  city: 120,
  phone: 60,
  message: 4000,
  intent: 40,
  intentLabel: 80,
};

/* Zusatzfelder: höchstens vier je Anliegen (Handoff §9), kurze Werte. */
const MAX_DETAILS = 6;
const MAX_DETAIL = { label: 80, value: 200 };

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function sanitize(body) {
  const out = {};
  for (const key of Object.keys(MAX)) out[key] = str(body?.[key], MAX[key]);

  out.details = Array.isArray(body?.details)
    ? body.details
        .slice(0, MAX_DETAILS)
        .map((d) => ({
          label: str(d?.label, MAX_DETAIL.label),
          value: str(d?.value, MAX_DETAIL.value),
        }))
        .filter((d) => d.label && d.value)
    : [];

  return out;
}

function validate(d) {
  if (!INTENTS.has(d.intent)) return "Anliegen fehlt oder ist unbekannt.";
  if (!d.name) return "Name fehlt.";
  if (!EMAIL_RE.test(d.email)) return "E-Mail-Adresse ist ungültig.";
  if (!d.message) return "Nachricht fehlt.";
  return null;
}

/* Der Fließtext der Benachrichtigungsmail. Die Zusatzfelder stehen als Block
   über der Nachricht, weil sie entscheiden, ob eine Anfrage planbar ist. */
function mailBody(d) {
  const lines = [
    `Anliegen: ${d.intentLabel || d.intent}`,
    `Name: ${d.name}`,
    `E-Mail: ${d.email}`,
    d.company && `Unternehmen / Location: ${d.company}`,
    d.city && `Ort / PLZ: ${d.city}`,
    d.phone && `Telefon: ${d.phone}`,
    ...d.details.map((x) => `${x.label}: ${x.value}`),
    "",
    d.message,
  ];
  return lines.filter(Boolean).join("\n");
}

async function deliver(data) {
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "kontakt", ...data }),
    });
    if (!res.ok) throw new Error(`Webhook antwortete mit ${res.status}`);
    return "webhook";
  }

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || BUSINESS.email;
  if (resendKey && to) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || `kontakt@${BUSINESS.email.split("@")[1]}`,
        to,
        reply_to: data.email,
        subject: `[${data.intentLabel || data.intent}] Anfrage von ${data.name}`,
        text: mailBody(data),
      }),
    });
    if (!res.ok) throw new Error(`Resend antwortete mit ${res.status}`);
    return "email";
  }

  /* 3. SMTP — Versand über ein bestehendes Postfach.

     Für diese Installation der vorgesehene Weg. Die Postfächer der Domain
     liegen bei Strato, und ihr SPF-Eintrag autorisiert Stratos Mailserver
     bereits (v=spf1 redirect=_spf.strato.com). Wer über genau diesen Server
     versendet, besteht die SPF-Prüfung deshalb ohne eine einzige
     DNS-Änderung — ein fremder Versanddienst kostete einen DKIM-Schlüssel
     plus einen Umbau des SPF-Eintrags, und `redirect=` verträgt kein
     schlichtes Anhängen.

     `from` ist per Vorgabe das authentifizierte Postfach selbst. Strato
     lehnt — wie die meisten Provider — eine Absenderadresse ab, die nicht
     zum Konto gehört; eine frei gewählte Adresse ließe den Versand mit 550
     scheitern. `replyTo` trägt die Adresse des Anfragenden, damit „Antworten"
     im Postfach direkt bei ihm landet und nicht bei uns selbst.

     Die drei Timeouts sind nicht dekorativ: Ohne sie hält ein stiller
     SMTP-Server die Anfrage bis zum Server-Timeout offen, und der Besucher
     sieht ein Formular, das sich nicht mehr rührt. */
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  if (smtpHost && smtpUser && smtpPassword && to) {
    /* 465 spricht ab der ersten Nachricht TLS, 587 handelt es über STARTTLS
       aus. Die Unterscheidung ist genau diese Zahl. */
    const port = Number(process.env.SMTP_PORT) || 465;
    const transport = nodemailer.createTransport({
      host: smtpHost,
      port,
      secure: port === 465,
      auth: { user: smtpUser, pass: smtpPassword },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });

    await transport.sendMail({
      from: process.env.CONTACT_FROM_EMAIL || smtpUser,
      to,
      replyTo: data.email,
      subject: `[${data.intentLabel || data.intent}] Anfrage von ${data.name}`,
      text: mailBody(data),
    });
    return "smtp";
  }

  console.log("[kontakt] Anfrage erhalten (kein Versandkanal konfiguriert):", data);
  return "log";
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const data = sanitize(body);
  const error = validate(data);
  if (error) return NextResponse.json({ ok: false, error }, { status: 422 });

  try {
    const channel = await deliver(data);
    return NextResponse.json({ ok: true, channel });
  } catch (err) {
    console.error("[kontakt] Zustellung fehlgeschlagen:", err);
    return NextResponse.json(
      { ok: false, error: "Die Nachricht konnte gerade nicht zugestellt werden." },
      { status: 502 }
    );
  }
}
