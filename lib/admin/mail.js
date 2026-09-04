import nodemailer from "nodemailer";
import { BUSINESS, SITE_URL } from "@/lib/site";

/* Getting the sign-in link into someone's mailbox.

   Two channels, tried in order — Resend, then SMTP — and they are the same
   two the contact form uses, with the same environment variables, because a
   deployment that can already send mail should not need a second setup for
   this. The code is separate from app/api/contact/route.js on purpose: that
   route belongs to the storefront and delivers a message from a stranger to
   the house. This one delivers a CREDENTIAL to a named person, and the two
   should never be one function with a flag.

   NO WEBHOOK CHANNEL, and that is the one deliberate difference. The contact
   form can post to Zapier or a Slack hook because an inquiry is meant to be
   read by the team. A sign-in link posted into a channel is a key on a
   noticeboard.

   Without any channel configured the link is written to the server log and —
   in development only — handed back to the caller so the login page can show
   it on screen. In production it is logged and nothing else: a backoffice
   that prints its own sign-in links in the browser would be a backoffice
   without a door. */

const FROM_FALLBACK = () => {
  const domain = BUSINESS.email.split("@")[1];
  return `Maria Maria Backoffice <noreply@${domain}>`;
};

const senderAddress = () =>
  process.env.ADMIN_MAIL_FROM || process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER || null;

/* The link's own words. Plain text, because a sign-in mail that renders as a
   wall of HTML in a strict client is a sign-in mail nobody can use — and
   because the only thing that matters here is one address, visible in full.
   German: the backoffice's own UI can be switched to Italian or English, but
   the mail is written before anyone has signed in, so there is nobody to ask. */
function body({ url, name, minutes, requestedBy }) {
  return [
    `Hallo ${name},`,
    "",
    "hier ist Ihr Anmeldelink für das Maria Maria Backoffice:",
    "",
    url,
    "",
    `Der Link gilt ${minutes} Minuten und lässt sich genau einmal verwenden.`,
    requestedBy
      ? `Angefordert wurde er über ${requestedBy}.`
      : "Angefordert wurde er über die Anmeldeseite.",
    "",
    "Wenn Sie das nicht waren, ist nichts passiert: Ohne den Link kommt niemand",
    "hinein, und er läuft von selbst ab. Sie brauchen nichts zu tun.",
    "",
    "— Maria Maria · Backoffice",
    SITE_URL,
  ].join("\n");
}

async function viaResend({ to, subject, text }) {
  const key = process.env.RESEND_API_KEY;
  const from = senderAddress() || FROM_FALLBACK();
  if (!key) return null;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, text }),
  });
  if (!res.ok) throw new Error(`Resend antwortete mit ${res.status}`);
  return "resend";
}

async function viaSmtp({ to, subject, text }) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) return null;

  /* 465 speaks TLS from the first byte, 587 negotiates it via STARTTLS — the
     distinction is exactly this number. Timeouts are not decoration: without
     them a silent server holds the request open until the server timeout, and
     the person waiting sees a form that never answers. */
  const port = Number(process.env.SMTP_PORT) || 465;
  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  /* The authenticated mailbox is the sender by default — Strato and most
     providers refuse a From that does not belong to the account, and the
     send would fail with 550. */
  await transport.sendMail({ from: senderAddress() || user, to, subject, text });
  return "smtp";
}

/** Is there any way to send at all? The login page and the invite form ask,
    so they can say so instead of promising mail that will never arrive. */
export const mailConfigured = () =>
  Boolean(process.env.RESEND_API_KEY) ||
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);

/**
 * Send one sign-in link.
 * @returns {Promise<{channel: string, link?: string}>} `link` comes back only
 *   in development with no channel configured — the login page shows it there.
 */
export async function sendSignInLink({ to, name, url, minutes, requestedBy = null }) {
  const subject = "Ihr Anmeldelink für das Maria Maria Backoffice";
  const text = body({ url, name: name || to, minutes, requestedBy });

  const channel = (await viaResend({ to, subject, text })) ?? (await viaSmtp({ to, subject, text }));
  if (channel) return { channel };

  console.log(`[admin] Anmeldelink für ${to} (kein Versandkanal konfiguriert): ${url}`);
  return process.env.NODE_ENV === "production" ? { channel: "log" } : { channel: "log", link: url };
}

/**
 * Tell someone they now have access. Sent when the owner adds them, together
 * with their first link — an invitation that arrives without explanation
 * looks like phishing, which is exactly what people are told to delete.
 */
export async function sendInvite({ to, name, url, minutes, invitedBy }) {
  const subject = "Ihr Zugang zum Maria Maria Backoffice";
  const text = [
    `Hallo ${name || to},`,
    "",
    `${invitedBy || "Maria Maria"} hat Ihnen Zugang zum Backoffice der Website`,
    "maria-maria.de eingerichtet. Dort werden Weine, Bilder, Regionen und",
    "Anfragen gepflegt.",
    "",
    "Ein Passwort brauchen Sie nicht: Sie melden sich an, indem Sie sich einen",
    "Link an diese Adresse schicken lassen. Der erste liegt schon bereit:",
    "",
    url,
    "",
    `Er gilt ${minutes} Minuten und lässt sich einmal verwenden. Danach jederzeit`,
    `neu anfordern unter ${SITE_URL}/admin/login`,
    "",
    "— Maria Maria · Backoffice",
  ].join("\n");

  const channel = (await viaResend({ to, subject, text })) ?? (await viaSmtp({ to, subject, text }));
  if (channel) return { channel };

  console.log(`[admin] Einladung für ${to} (kein Versandkanal konfiguriert): ${url}`);
  return process.env.NODE_ENV === "production" ? { channel: "log" } : { channel: "log", link: url };
}
