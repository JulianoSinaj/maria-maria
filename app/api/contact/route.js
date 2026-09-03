import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { BUSINESS } from "@/lib/site";
import {
  INQUIRY_LANGUAGES,
  sanitizeSubmission,
  validateSubmission,
} from "@/lib/inquiries/schema";
import {
  create as fileInquiry,
  findRecentDuplicate,
  update as updateInquiry,
} from "@/lib/inquiries/store";

/* Kontakt-Endpoint — nimmt das Anfrageformular entgegen, validiert
   serverseitig, legt die Anfrage im Posteingang des Backoffice ab
   (lib/inquiries, sichtbar unter /admin/anfragen) und leitet sie DANACH an
   einen konfigurierbaren Kanal weiter:
   1. CONTACT_WEBHOOK_URL  — beliebiger Webhook (Zapier/Make/Slack/CRM), erhält JSON
   2. RESEND_API_KEY + CONTACT_TO_EMAIL — Versand als E-Mail über Resend
   3. SMTP_HOST + SMTP_USER + SMTP_PASSWORD — Versand über ein bestehendes
      Postfach (hier: Strato), siehe die Begründung bei deliver()
   Ohne Konfiguration bleibt es beim Eintrag im Posteingang plus einer
   Zeile im Server-Log.

   Erst ablegen, dann versenden — in dieser Reihenfolge, weil das Formular
   die einzige Stelle ist, an der aus einem Besuch Geschäft wird. Bis
   September 2026 ging die Nachricht als Mail hinaus und nirgends blieb
   eine Spur: Eine abgewiesene Mail war eine verlorene Anfrage. Jetzt ist
   der Eintrag da, bevor irgendein Mailserver gefragt wurde.

   Die Nutzlast folgt dem Kontakt-Handoff vom 18.08.2026: ein stabiles
   `intent` (gastronomie_feinkost, event_feier …), die fünf Basisangaben,
   eine Liste `details` mit den Zusatzfeldern des gewählten Anliegens und
   seit dem Posteingang die Sprache der Seite (`language`), von der aus
   die Anfrage kam. Die Liste kommt fertig beschriftet aus dem Formular —
   das Team liest die Mail, und „8" ohne „Anzahl der Personen" davor sagt
   nichts.

   Serverseitig wird trotzdem alles neu geprüft (lib/inquiries/schema.js —
   ein reines Servermodul, kein Client-Code): Ein Client, der Felder
   mitschickt, die es im Formular nicht gibt, ist genau der Fall, für den
   diese Funktion existiert. */

/* --- Spam-Schutz ---------------------------------------------------------

   Zwei billige Hürden, die den Großteil automatisierter Einsendungen
   abfangen, ohne einem Menschen ein Captcha zuzumuten:

   1. Honeypot. Das Formular trägt ein für Menschen unsichtbares Feld
      `website` (components/kontakt/ContactForm.jsx). Formular-Skripte
      füllen jedes Textfeld, das sie finden. Steht darin etwas, antwortet
      der Endpunkt mit demselben 200 wie bei Erfolg — und wirft die
      Einsendung weg, ohne sie abzulegen oder zu versenden. Ein 4xx wäre
      ein Hinweis an den Absender, dass er erkannt wurde.

   2. Rate-Limit je IP. Höchstens CONTACT_RATE_MAX Einsendungen (Vorgabe 5)
      in CONTACT_RATE_WINDOW_SEC Sekunden (Vorgabe 15 Minuten), gezählt
      über alle Versuche einschließlich ungültiger — ein Skript, das
      Varianten durchprobiert, soll nicht mit jeder 422 einen neuen
      Versuch frei haben. Im Arbeitsspeicher, nicht in einer Datenbank:
      Der Zähler darf mit einem Neustart verfallen, es geht um Wellen,
      nicht um Buchführung. Hinter einem Proxy zählt der erste Eintrag in
      x-forwarded-for — den setzt der äußerste Proxy. */

const HONEYPOT_FIELD = "website";

const RATE = {
  max: Number(process.env.CONTACT_RATE_MAX) || 5,
  windowMs: (Number(process.env.CONTACT_RATE_WINDOW_SEC) || 15 * 60) * 1000,
};

globalThis.__mmContactRate ??= new Map();
const attempts = globalThis.__mmContactRate;

function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim() || "unknown";
  return request.headers.get("x-real-ip") || request.ip || "unknown";
}

function rateLimited(ip, now = Date.now()) {
  const fresh = (attempts.get(ip) ?? []).filter((t) => now - t < RATE.windowMs);
  if (fresh.length >= RATE.max) {
    attempts.set(ip, fresh);
    return true;
  }
  fresh.push(now);
  attempts.set(ip, fresh);

  /* Die Tabelle wächst mit jeder neuen Adresse; abgelaufene Einträge
     verschwinden, sobald sie spürbar wird. */
  if (attempts.size > 2000) {
    for (const [key, stamps] of attempts) {
      if (!stamps.some((t) => now - t < RATE.windowMs)) attempts.delete(key);
    }
  }
  return false;
}

/* Sprache der Seite, von der die Anfrage kam. Das Formular schickt
   document.documentElement.lang mit („it-IT"); fehlt der Wert, verrät der
   Referer das Sprachsegment der Adresse (/it/kontakt). Ohne beides:
   Deutsch, die Sprache ohne Präfix. */
function languageOf(body, request) {
  if (typeof body?.language === "string" && body.language.trim()) return body.language;
  try {
    const seg = new URL(request.headers.get("referer") ?? "").pathname.split("/")[1];
    if (INQUIRY_LANGUAGES.includes(seg)) return seg;
  } catch {
    /* kein oder kein gültiger Referer */
  }
  return "de";
}

/* Der Fließtext der Benachrichtigungsmail. Die Zusatzfelder stehen als Block
   über der Nachricht, weil sie entscheiden, ob eine Anfrage planbar ist.
   Referenz und Sprache am Ende des Blocks: Die Referenz findet den Eintrag
   im Backoffice wieder, die Sprache sagt, in welcher man antwortet. */
function mailBody(d, record) {
  const lines = [
    `Anliegen: ${d.intentLabel || d.intent}`,
    `Name: ${d.name}`,
    `E-Mail: ${d.email}`,
    d.company && `Unternehmen / Location: ${d.company}`,
    d.city && `Ort / PLZ: ${d.city}`,
    d.phone && `Telefon: ${d.phone}`,
    ...d.details.map((x) => `${x.label}: ${x.value}`),
    `Sprache der Seite: ${d.language}`,
    record && `Referenz: ${record.id}`,
    "",
    d.message,
  ];
  return lines.filter(Boolean).join("\n");
}

async function deliver(data, record) {
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "kontakt", id: record?.id ?? null, ...data }),
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
        text: mailBody(data, record),
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
      text: mailBody(data, record),
    });
    return "smtp";
  }

  console.log(
    "[kontakt] Anfrage im Posteingang abgelegt (kein Versandkanal konfiguriert):",
    record?.id ?? data.email,
  );
  return "inbox";
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { ok: false, error: "Zu viele Anfragen. Bitte versuchen Sie es in einigen Minuten erneut." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(RATE.windowMs / 1000)) } },
    );
  }

  /* Honeypot: Erfolg vortäuschen, nichts behalten. */
  if (typeof body?.[HONEYPOT_FIELD] === "string" && body[HONEYPOT_FIELD].trim()) {
    return NextResponse.json({ ok: true });
  }

  const data = sanitizeSubmission({ ...body, language: languageOf(body, request) });
  const error = validateSubmission(data);
  if (error) return NextResponse.json({ ok: false, error }, { status: 422 });

  /* 1. Ablegen — vor dem Versand.

     Dieselbe Nachricht von derselben Adresse innerhalb weniger Minuten ist
     ein Doppelklick oder ein zweiter Versuch nach langsamer Antwort, keine
     zweite Anfrage: Der vorhandene Eintrag wird wiederverwendet, und ist
     seine Mail schon draußen, geht keine zweite hinterher. */
  let record = null;
  try {
    record = findRecentDuplicate(data);
    if (record && record.delivery !== "failed" && record.delivery !== "pending") {
      return NextResponse.json({ ok: true, channel: record.delivery });
    }
    if (!record) record = fileInquiry(data);
  } catch (err) {
    /* Der Posteingang darf den Versand nicht verhindern — dann läuft es
       wie vor September 2026: nur die Mail. */
    console.error("[kontakt] Anfrage konnte nicht abgelegt werden:", err);
  }

  /* 2. Benachrichtigen. */
  try {
    const channel = await deliver(data, record);
    if (record) updateInquiry(record.id, { delivery: channel });
    return NextResponse.json({ ok: true, channel });
  } catch (err) {
    console.error("[kontakt] Zustellung fehlgeschlagen:", err);
    if (record) {
      /* Die Anfrage IST angekommen — sie liegt im Backoffice, dort mit dem
         Vermerk, dass die Mail nicht hinausging. Dem Besucher einen Fehler
         zu zeigen, hieße, ihn zu einer Wiederholung zu drängen, die genau
         dasselbe noch einmal ablegt. */
      updateInquiry(record.id, { delivery: "failed" });
      return NextResponse.json({ ok: true, channel: "inbox" });
    }
    return NextResponse.json(
      { ok: false, error: "Die Nachricht konnte gerade nicht zugestellt werden." },
      { status: 502 },
    );
  }
}
