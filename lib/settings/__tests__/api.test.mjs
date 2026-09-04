/* Einstellungen-API — Abnahmelauf gegen einen laufenden Dev-Server.
   Aufruf: npm run test:settings   (BASE_URL setzen, wenn nicht :3000)

   Der Lauf VERÄNDERT den Store und stellt den Anfangszustand am Ende wieder
   her: Er liest zuerst, was gespeichert ist, arbeitet, und spielt es zurück.
   Bricht er in der Mitte ab, bleibt der Store auf dem Stand des letzten
   Schritts — auf einem Dev-Server ist das der Preis dafür, echte Antworten
   statt Attrappen zu prüfen. */

import fs from "node:fs";
import path from "node:path";

const HOST = process.env.BASE_URL ?? "http://localhost:3000";
const B = `${HOST}/api/admin/settings`;

let pass = 0,
  fail = 0;
const ok = (c, m) => {
  c ? (pass++, console.log("  ✓ " + m)) : (fail++, console.log("  ✗ FAIL: " + m));
};
const J = async (u, i) => {
  const r = await fetch(u, i);
  return { s: r.status, b: await r.json().catch(() => null) };
};
const PUT = (body) =>
  J(B, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const DEL = (q = "") => J(`${B}${q}`, { method: "DELETE" });

/* ------------------------------------------------------- Ausgangszustand -- */

let r = await J(B);
if (r.s !== 200) {
  console.error(`Kein Zugriff auf ${B} (${r.s}). Läuft der Dev-Server?`);
  process.exit(1);
}
const before = r.b.data;

/** Den gemerkten Stand als Patch — damit der Lauf ihn am Ende zurückspielt. */
function snapshotPatch(rec) {
  const patch = {};
  if (rec.summary.firma.length) {
    patch.firma = Object.fromEntries(rec.summary.firma.map((k) => [k, rec.firma.value[k]]));
  }
  if (rec.summary.social.length) {
    patch.social = Object.fromEntries(rec.summary.social.map((k) => [k, rec.social.value[k]]));
  }
  const seo = {};
  for (const [locale, pages] of Object.entries(rec.summary.seo ?? {})) {
    for (const page of Object.keys(pages)) {
      (seo[locale] ??= {})[page] = { ...rec.seo[locale][page].value };
    }
  }
  if (Object.keys(seo).length) patch.seo = seo;
  if (rec.summary.redirectsChanged) patch.redirects = rec.redirects.value;
  return patch;
}
const restore = snapshotPatch(before);

/* Sauberer Ausgangspunkt für die Prüfungen. */
await DEL();

/* ------------------------------------------------------------- Voreinstellung */

console.log("SAAT (alles auf Code):");
r = await J(B);
const d = r.b.data;
ok(r.s === 200, "GET → 200");
ok(
  d.firma.value.legalName === "Maria Maria Wines GmbH" &&
    d.firma.value.postalCode === "40822" &&
    d.firma.value.city === "Mettmann",
  "Firma kommt aus BUSINESS in lib/site.js",
);
ok(d.firma.value.email === "info@maria-maria.de", "E-Mail ist die .de-Adresse, nicht .wine");
ok(d.firma.value.phone === "", "Telefon ist leer — in lib/site.js steht keine Nummer");
ok(
  d.firma.fixed.region === "Nordrhein-Westfalen" && d.firma.fixed.country === "DE",
  "Region und Land reisen als feste Angaben mit",
);
ok(
  d.social.value.instagram.includes("instagram.com/mariamaria.wine") &&
    d.social.value.linkedin.includes("linkedin.com"),
  "Social-Profile kommen aus SOCIAL_PROFILES",
);
ok(d.social.value.handle === "@mariamaria.wine", "Handle kommt aus magazinData");
ok(
  d.locales.join(",") === "de,it,en,cs",
  `SEO deckt die vier Sprachen der Storefront ab (${d.locales.join(",")})`,
);
ok(
  Object.keys(d.seo.de).length === 11 && Object.keys(d.seo.cs).length === 11,
  "elf Einträge je Sprache (Standard + zehn Seiten)",
);
ok(
  d.seo.de.home.absolute === true && d.seo.de.magazin.absolute === false,
  "Startseite trägt die Marke selbst (titleAbsolute), das Magazin nicht",
);
ok(
  d.seo.de.home.value.title === "Italienische Boutique-Weine in Deutschland | Maria Maria",
  "Titel der Startseite kommt aus content/de/meta.js",
);
ok(d.brandSuffix === " — Maria Maria", `Markensuffix fürs Budget (${JSON.stringify(d.brandSuffix)})`);
ok(d.summary.firma.length === 0 && d.summary.seoCount === 0, "nichts weicht vom Code ab");

console.log("\nVORSCHAU DER STRUKTURIERTEN DATEN:");
ok(d.jsonLd["@type"] === "Organization", "Knoten ist eine Organization, kein LocalBusiness");
ok(d.jsonLd.telephone === undefined, "ohne Nummer trägt der Knoten KEIN telephone");
ok(
  d.jsonLd.address.postalCode === "40822" && d.jsonLd.address.addressLocality === "Mettmann",
  "Anschrift steht im Knoten",
);
ok(Array.isArray(d.jsonLd.sameAs) && d.jsonLd.sameAs.length === 3, "drei Profile in sameAs");

/* -------------------------------------------------------------- Prüfungen -- */

console.log("\nVALIDIERUNG:");
r = await PUT({ firma: { email: "keine-adresse" } });
ok(r.s === 422, `unsaubere E-Mail → 422 (${r.b?.error})`);
r = await PUT({ firma: { phone: "Tel. bitte anrufen" } });
ok(r.s === 422, "Telefonnummer ohne Ziffern → 422");
r = await PUT({ firma: { legalName: "" } });
ok(r.s === 422, "Pflichtfeld leer → 422");
r = await PUT({ firma: { taxId: "DE123" } });
ok(r.s === 422, "unbekanntes Firmenfeld → 422");
r = await PUT({ social: { instagram: "http://www.instagram.com/x" } });
ok(r.s === 422, "Profil ohne https → 422");
r = await PUT({ social: { instagram: "https://www.example.com/x" } });
ok(r.s === 422, "Instagram-Feld mit fremdem Host → 422");
r = await PUT({ social: { handle: "mariamaria" } });
ok(r.s === 422, "Handle ohne @ → 422");
r = await PUT({ seo: { de: { katalog: { title: "x" } } } });
ok(r.s === 422, "unbekannte Seite → 422");
r = await PUT({ seo: { fr: { home: { title: "x" } } } });
ok(r.s === 422, "unbekannte Sprache → 422");
r = await PUT({ seo: { de: { home: { keywords: "x" } } } });
ok(r.s === 422, "nicht editierbares Feld → 422");
r = await PUT({ seo: { de: { home: { title: "" } } } });
ok(r.s === 422, "leerer Titel → 422");
r = await PUT({ redirects: [{ from: "galerie", to: "/geschichte" }] });
ok(r.s === 422, "Alt-Adresse ohne führenden Schrägstrich → 422");
r = await PUT({ redirects: [{ from: "/a", to: "/a" }] });
ok(r.s === 422, "Regel zeigt auf sich selbst → 422");
r = await PUT({
  redirects: [
    { from: "/a", to: "/b" },
    { from: "/a", to: "/c" },
  ],
});
ok(r.s === 422, "zwei Regeln für dieselbe Alt-Adresse → 422");
r = await PUT({ tracking: { ga: "UA-1" } });
ok(r.s === 422, "unbekannte Gruppe → 422");

/* ---------------------------------------------------------------- Schreiben */

console.log("\nFIRMA SCHREIBEN:");
r = await PUT({ firma: { phone: "+49 2104 1234567" } });
ok(r.s === 200, "gültige Nummer → 200");
ok(r.b.data.jsonLd.telephone === "+49 2104 1234567", "Nummer erscheint im Knoten");
ok(
  r.b.data.jsonLd.contactPoint.telephone === "+49 2104 1234567",
  "…und am contactPoint, wo Google sie ebenfalls liest",
);
ok(r.b.data.summary.firma.includes("phone"), "Feld gilt als geändert");

r = await PUT({ firma: { city: "Düsseldorf" } });
ok(r.b.data.jsonLd.address.addressLocality === "Düsseldorf", "Ort wandert in die Anschrift");
ok(
  r.b.data.firma.value.legalName === "Maria Maria Wines GmbH",
  "Teilpatch lässt die übrigen Felder unangetastet",
);

r = await PUT({ firma: { city: "Mettmann" } });
ok(
  !r.b.data.summary.firma.includes("city"),
  "zurückgetippter Originalwert wird nicht gespeichert, sondern gelöscht",
);

console.log("\nSOCIAL SCHREIBEN:");
r = await PUT({ social: { linkedin: "" } });
ok(r.s === 200 && r.b.data.jsonLd.sameAs.length === 2, "leeres Profil fällt aus sameAs heraus");
r = await PUT({ social: { linkedin: before.social.seed.linkedin } });
ok(r.b.data.jsonLd.sameAs.length === 3, "wieder eingetragen → wieder drei Profile");

console.log("\nSEO SCHREIBEN:");
const neuerTitel = "Italienische Boutique-Weine | Maria Maria";
r = await PUT({ seo: { de: { home: { title: neuerTitel } } } });
ok(r.s === 200 && r.b.data.seo.de.home.value.title === neuerTitel, "Titel gespeichert");
ok(
  r.b.data.seo.de.home.seed.title === "Italienische Boutique-Weine in Deutschland | Maria Maria",
  "die Saat bleibt daneben sichtbar",
);
ok(r.b.data.summary.seo.de?.home?.includes("title"), "Änderung ist gezählt");
ok(
  r.b.data.seo.it.home.value.title === r.b.data.seo.it.home.seed.title,
  "andere Sprachen bleiben unberührt",
);
r = await PUT({ seo: { de: { home: { title: r.b.data.seo.de.home.seed.title } } } });
ok(!r.b.data.summary.seo.de, "zurückgesetzter Titel räumt den Eintrag wieder ab");

console.log("\nWEITERLEITUNGEN:");
r = await J(B);
const seedRules = r.b.data.redirects.seed;
ok(seedRules.length === 15, `Saat: 14 genaue Regeln + eine Präfixregel (${seedRules.length})`);
ok(
  seedRules.some((x) => x.from === "/galerie" && x.to === "/geschichte"),
  "/galerie → /geschichte ist dabei",
);
ok(
  seedRules.some((x) => x.from === "/weine" && x.kind === "prefix"),
  "die Präfixregel aus legacyTarget() steht als Regel in der Liste",
);

r = await PUT({ redirects: [...seedRules, { from: "/presse", to: "/magazin", kind: "exact" }] });
ok(r.s === 200 && r.b.data.redirects.value.length === 16, "Regel hinzugefügt");
ok(r.b.data.summary.redirectsChanged === true, "Liste gilt als geändert");

r = await PUT({ redirects: seedRules });
ok(
  r.b.data.summary.redirectsChanged === false,
  "wieder identisch zur Saat → Eintrag verschwindet, der Code gilt",
);

console.log("\nZURÜCKSETZEN:");
await PUT({ firma: { phone: "+49 2104 999" }, social: { handle: "@test.handle" } });
r = await DEL("?group=firma");
ok(r.s === 200 && r.b.data.summary.firma.length === 0, "?group=firma setzt nur die Firma zurück");
ok(r.b.data.summary.social.includes("handle"), "…und lässt Social stehen");
r = await DEL();
ok(
  r.b.data.summary.firma.length === 0 && r.b.data.summary.social.length === 0,
  "DELETE ohne Gruppe setzt alles zurück",
);
r = await DEL("?group=tracking");
ok(r.s === 422, "unbekannte Gruppe beim Zurücksetzen → 422");

/* ------------------------------------------- Abgleich mit der Middleware -- */

console.log("\nSPIEGEL VON LEGACY_PATHS (middleware.js):");
const mw = fs.readFileSync(path.join(process.cwd(), "middleware.js"), "utf8");
const block = mw.match(/const LEGACY_PATHS = new Map\(\[([\s\S]*?)\]\);/);
if (!block) {
  ok(false, "LEGACY_PATHS in middleware.js gefunden");
} else {
  const inMiddleware = [...block[1].matchAll(/\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]/g)].map((m) => ({
    from: m[1],
    to: m[2],
  }));
  const mirrored = seedRules.filter((x) => x.kind === "exact");

  ok(
    inMiddleware.length === mirrored.length,
    `gleiche Anzahl genauer Regeln (middleware ${inMiddleware.length}, Store ${mirrored.length})`,
  );
  const missing = inMiddleware.filter(
    (a) => !mirrored.some((b) => b.from === a.from && b.to === a.to),
  );
  const extra = mirrored.filter(
    (b) => !inMiddleware.some((a) => a.from === b.from && a.to === b.to),
  );
  ok(
    missing.length === 0,
    missing.length
      ? `im Store FEHLEN: ${missing.map((x) => x.from).join(", ")} — REDIRECT_SEED in lib/settings/store.js nachziehen`
      : "jede Regel aus middleware.js steht im Store",
  );
  ok(
    extra.length === 0,
    extra.length
      ? `im Store ZU VIEL: ${extra.map((x) => x.from).join(", ")} — middleware.js nachziehen oder Eintrag entfernen`
      : "der Store erfindet keine Regel, die middleware.js nicht kennt",
  );
  ok(
    /path === "\/weine"/.test(mw) && /path\.startsWith\("\/weine\/"\)/.test(mw),
    "die Präfixregel /weine steht weiterhin in legacyTarget()",
  );
}

/* ------------------------------------------------------ Ausgangszustand ---- */

if (Object.keys(restore).length) {
  const back = await PUT(restore);
  console.log(
    back.s === 200
      ? "\nAusgangszustand des Stores wiederhergestellt."
      : `\nWARNUNG: Ausgangszustand NICHT wiederhergestellt (${back.s}).`,
  );
} else {
  console.log("\nDer Store stand vorher auf den Werten des Codes — nichts zurückzuspielen.");
}

console.log(`\n${pass} bestanden, ${fail} fehlgeschlagen`);
process.exit(fail ? 1 : 0);
