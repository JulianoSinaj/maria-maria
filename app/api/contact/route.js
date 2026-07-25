import { NextResponse } from "next/server";

/* Kontakt-Endpoint — nimmt das Formular entgegen, validiert serverseitig und
   leitet die Anfrage an einen konfigurierbaren Kanal weiter:
   1. CONTACT_WEBHOOK_URL  — beliebiger Webhook (Zapier/Make/Slack/CRM), erhält JSON
   2. RESEND_API_KEY + CONTACT_TO_EMAIL — Versand als E-Mail über Resend
   Ohne Konfiguration wird die Anfrage im Server-Log festgehalten, damit im
   Staging nichts verloren geht. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX = { name: 120, email: 200, subject: 200, message: 4000, topic: 60, date: 20, guests: 10 };

function sanitize(body) {
  const out = {};
  for (const key of Object.keys(MAX)) {
    const v = body?.[key];
    out[key] = typeof v === "string" ? v.trim().slice(0, MAX[key]) : "";
  }
  return out;
}

function validate(d) {
  if (!d.name) return "Name fehlt.";
  if (!EMAIL_RE.test(d.email)) return "E-Mail-Adresse ist ungültig.";
  if (!d.subject) return "Betreff fehlt.";
  if (!d.topic) return "Anliegen fehlt.";
  if (!d.message) return "Nachricht fehlt.";
  return null;
}

async function deliver(data) {
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "maria-maria.wine/kontakt", ...data }),
    });
    if (!res.ok) throw new Error(`Webhook antwortete mit ${res.status}`);
    return "webhook";
  }

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (resendKey && to) {
    const tasting =
      data.topic === "Verkostungsanfrage"
        ? `\nWunschtermin: ${data.date || "—"}\nGäste: ${data.guests || "—"}\n`
        : "";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "kontakt@maria-maria.wine",
        to,
        reply_to: data.email,
        subject: `[${data.topic}] ${data.subject}`,
        text: `Von: ${data.name} <${data.email}>\nAnliegen: ${data.topic}${tasting}\n\n${data.message}`,
      }),
    });
    if (!res.ok) throw new Error(`Resend antwortete mit ${res.status}`);
    return "email";
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
