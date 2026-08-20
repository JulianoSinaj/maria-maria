import { NextResponse } from "next/server";

/* Kontakt-Endpoint — nimmt das Lead-Formular der Kontaktseite entgegen,
   validiert serverseitig und leitet die Anfrage an einen konfigurierbaren
   Kanal weiter:
   1. CONTACT_WEBHOOK_URL  — beliebiger Webhook (Zapier/Make/Slack/CRM), erhält JSON
   2. RESEND_API_KEY + CONTACT_TO_EMAIL — Versand als E-Mail über Resend
   Ohne Konfiguration wird die Anfrage im Server-Log festgehalten, damit im
   Staging nichts verloren geht.

   Vertrag mit components/kontakt/ContactForm.jsx (Kontakt-Handoff 18.08.2026):
   Das Formular schickt SCHLÜSSEL, keine Beschriftungen — `intent` aus der
   festen Liste unten, bedingte Angaben als `details` (Schlüssel → Wert,
   Select-Werte ebenfalls als Schlüssel). Dieser Endpoint übersetzt sie in
   deutschen Klartext für die Benachrichtigung: Das Team liest Deutsch, egal
   ob das Formular auf Italienisch, Englisch oder Tschechisch ausgefüllt wurde.
   Die Schlüssel bleiben im Payload (Webhook/CRM routen danach). */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Stabile Anliegen-Schlüssel (Handoff §14) → deutscher Klartext */
const INTENTS = {
  gastronomie_feinkost: "Gastronomie & Feinkost",
  handel_wiederverkauf: "Handel & Wiederverkauf",
  event_feier: "Event / Feier",
  verkostung: "Verkostung",
  individuelle_auswahl: "Individuelle Weinauswahl",
  sonstiges: "Sonstiges",
};

/* Grundfelder mit Längenlimits — alles darüber wird abgeschnitten, nicht
   abgelehnt: ein zu langer Name ist kein Grund, eine Anfrage zu verlieren. */
const MAX = {
  intent: 40,
  name: 120,
  email: 200,
  companyLocation: 200,
  postalCity: 120,
  phone: 60,
  message: 4000,
  language: 5,
};

/* Bedingte Felder je Anliegen (Handoff §9): erlaubte Schlüssel, Beschriftung
   für die Mail, ggf. Wertelisten. Unbekannte Schlüssel werden verworfen —
   der Endpoint nimmt nur an, was das Formular dieses Anliegens kennt. */
const DETAIL_FIELDS = {
  event_feier: {
    eventDate: { label: "Datum / Wunschtermin" },
    eventType: { label: "Art des Events" },
    guests: { label: "Ungefähre Gästezahl" },
    location: { label: "Location / Ort" },
  },
  gastronomie_feinkost: {
    businessType: {
      label: "Art des Betriebs",
      options: { restaurant: "Restaurant", cafe: "Café", weinbar: "Weinbar", feinkost: "Feinkost", sonstiges: "Sonstiges" },
    },
    interest: { label: "Interesse / gewünschte Auswahl" },
  },
  handel_wiederverkauf: {
    businessType: {
      label: "Art des Betriebs",
      options: { weinhandel: "Weinhandel", feinkost: "Feinkost", fachhandel: "Fachhandel", sonstiges: "Sonstiges" },
    },
    interest: { label: "Interesse / gewünschte Auswahl" },
  },
  verkostung: {
    date: { label: "Wunschtermin" },
    persons: { label: "Anzahl der Personen" },
    occasion: {
      label: "Anlass",
      options: {
        privat: "privat",
        unternehmen: "Unternehmen/Team",
        gastronomie_handel: "Gastronomie/Handel",
        sonstiger: "sonstiger Anlass",
      },
    },
  },
  individuelle_auswahl: {
    context: { label: "Anlass / Kontext" },
    guests: { label: "Gästezahl" },
    style: { label: "Bevorzugte Stilrichtung" },
  },
  sonstiges: {},
};

const DETAIL_MAX = 300;

const clip = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function sanitize(body) {
  const out = {};
  for (const key of Object.keys(MAX)) out[key] = clip(body?.[key], MAX[key]);

  /* Details: nur die Schlüssel des gewählten Anliegens, nur Strings, nur
     gefüllte. Select-Werte müssen aus der Liste stammen — sonst fliegen sie. */
  const allowed = DETAIL_FIELDS[out.intent] ?? {};
  const details = {};
  const raw = body?.details && typeof body.details === "object" ? body.details : {};
  for (const key of Object.keys(allowed)) {
    const value = clip(raw[key], DETAIL_MAX);
    if (!value) continue;
    const opts = allowed[key].options;
    if (opts && !opts[value]) continue;
    details[key] = value;
  }
  out.details = details;
  return out;
}

function validate(d) {
  if (!INTENTS[d.intent]) return "Anliegen fehlt oder ist unbekannt.";
  if (!d.name) return "Name fehlt.";
  if (!EMAIL_RE.test(d.email)) return "E-Mail-Adresse ist ungültig.";
  if (!d.message) return "Nachricht fehlt.";
  return null;
}

/* Deutscher Klartext für Mail und Log — Schlüssel bleiben daneben erhalten. */
function describe(d) {
  const fields = DETAIL_FIELDS[d.intent] ?? {};
  const detailLines = Object.entries(d.details).map(([key, value]) => {
    const def = fields[key];
    const text = def?.options ? def.options[value] ?? value : value;
    return `${def?.label ?? key}: ${text}`;
  });
  return {
    intentLabel: INTENTS[d.intent],
    detailLines,
  };
}

async function deliver(data) {
  const { intentLabel, detailLines } = describe(data);
  const payload = {
    source: "kontakt-formular",
    ...data,
    intentLabel,
    detailsText: detailLines.join("\n"),
  };

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Webhook antwortete mit ${res.status}`);
    return "webhook";
  }

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (resendKey && to) {
    const head = [
      `Anliegen: ${intentLabel}`,
      `Von: ${data.name} <${data.email}>`,
      data.companyLocation ? `Unternehmen / Location: ${data.companyLocation}` : null,
      data.postalCity ? `Ort / PLZ: ${data.postalCity}` : null,
      data.phone ? `Telefon: ${data.phone}` : null,
      data.language ? `Formularsprache: ${data.language}` : null,
    ].filter(Boolean);
    const lines = [...head, ...(detailLines.length ? ["", ...detailLines] : []), "", data.message];

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        /* Absender aus der Umgebung — die Domain muss bei Resend verifiziert
           sein; CONTACT_FROM_EMAIL setzen. Der Fallback folgt der offiziellen
           Domain aus dem Kontakt-Handoff (maria-maria.de). */
        from: process.env.CONTACT_FROM_EMAIL || "kontakt@maria-maria.de",
        to,
        reply_to: data.email,
        subject: `[Kontakt · ${intentLabel}] ${data.name}${data.companyLocation ? ` – ${data.companyLocation}` : ""}`,
        text: lines.join("\n"),
      }),
    });
    if (!res.ok) throw new Error(`Resend antwortete mit ${res.status}`);
    return "email";
  }

  console.log("[kontakt] Anfrage erhalten (kein Versandkanal konfiguriert):", payload);
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
