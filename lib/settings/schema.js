/* Einstellungen — Struktur, Grenzen und Prüfungen der Seiteneinstellungen.
   ==========================================================================
   Vier Gruppen auf einer Seite (/admin/einstellungen):

     firma         Rechtsname, Anschrift, E-Mail, Telefon
     social        Instagram, Facebook, LinkedIn, Handle
     seo           Titel und Description je Seite und Sprache
     redirects     Alte Adresse → neue Adresse

   Diese Datei ist reine Struktur ohne Node-Abhängigkeit: Der Editor im
   Browser liest sie für Felder, Budgets und die Vorschau der
   Weiterleitungen, der Store nebenan (./store.js) für die Prüfung beim
   Schreiben. Eine Regel, die an zwei Stellen lebt, driftet auseinander —
   deshalb liegt sie hier einmal.

   Saat („seed") ist überall der Code: BUSINESS und SOCIAL_PROFILES aus
   lib/site.js, die Metatexte aus content/<sprache>/meta.js, die Alt-Adressen
   aus middleware.js. Ein Feld ohne Eintrag im Store IST der Code; ein
   Eintrag ersetzt ihn. Zurück zum Code heißt: Eintrag löschen. */

/* ------------------------------------------------------------- Gruppen ---- */

export const SETTINGS_GROUPS = Object.freeze(["firma", "social", "seo", "redirects"]);

export const isSettingsGroup = (v) => SETTINGS_GROUPS.includes(v);

/* --------------------------------------------------------------- Firma ---- */

/* Die sechs Felder des Auftrags. `region` und `country` stehen bewusst NICHT
   darunter: Sie sind Teil der PostalAddress im JSON-LD, ändern sich mit einem
   Umzug innerhalb Deutschlands aber nicht mit — die Vorschau zeigt sie als
   feste Werte aus dem Code. */
export const BUSINESS_FIELDS = Object.freeze([
  { key: "legalName", max: 160, required: true },
  { key: "street", max: 160, required: true },
  { key: "postalCode", max: 16, required: true },
  { key: "city", max: 80, required: true },
  { key: "email", max: 200, required: true, kind: "email" },
  /* Als einziges Feld NICHT erforderlich, und das ist der Punkt: Die Nummer
     aus dem Mockup (+49 211 976 420) ist laut Kunde falsch, seither steht in
     lib/site.js gar keine. Eine falsche Nummer im JSON-LD wandert in den
     Wissensgraph und in Google Maps und ist von dort schwer wieder
     herauszubekommen — leer ist besser als falsch, bis jemand die richtige
     bestätigt. */
  { key: "phone", max: 40, kind: "phone" },
]);

export const BUSINESS_KEYS = Object.freeze(BUSINESS_FIELDS.map((f) => f.key));

/* -------------------------------------------------------------- Social ---- */

/* Instagram, Facebook und der Handle nennt der Auftrag. LinkedIn steht
   trotzdem hier: Das Profil liegt in SOCIAL_PROFILES (lib/site.js) und geht
   als `sameAs` in die strukturierten Daten ein. Eine Einstellungsseite, die
   sich als Quelle dieser Werte ausgibt und eines davon verschweigt, löscht
   es beim ersten Speichern. */
export const SOCIAL_FIELDS = Object.freeze([
  { key: "instagram", max: 200, kind: "url", host: "instagram.com" },
  { key: "facebook", max: 200, kind: "url", host: "facebook.com" },
  { key: "linkedin", max: 200, kind: "url", host: "linkedin.com" },
  /* Der Name, unter dem die Marke auf den Plattformen auftritt — steht als
     Text auf der Pinnwand des Magazins, nicht als Adresse. */
  { key: "handle", max: 60, kind: "handle" },
]);

export const SOCIAL_KEYS = Object.freeze(SOCIAL_FIELDS.map((f) => f.key));

/* ----------------------------------------------------------------- SEO ---- */

/* Was Google in der Ergebniszeile zeigt: rund 60 Zeichen Titel, rund 155
   Zeichen Description. Beides sind Richtwerte, keine Grenzen — gemessen wird
   in Pixeln, nicht in Zeichen. Der Editor warnt darüber, verbietet aber
   nichts; erst `max` ist eine echte Grenze und liegt weit darüber, damit
   niemand mitten im Satz ausgebremst wird. */
export const SEO_BUDGET = Object.freeze({ title: 60, description: 155 });
export const SEO_MAX = Object.freeze({ title: 140, description: 400 });

/* Die Seiten mit einem Titel-Description-Paar in content/<sprache>/meta.js.

   Nicht dabei, jeweils mit Grund:
     wine       Vorlagen mit Platzhaltern ({name}, {year}), keine Sätze —
                lib/seo/wine.js setzt sie je Wein zusammen.
     notFound   trägt nur einen Titel und ist ohnehin auf noindex.
     orgDescription  beschreibt das Unternehmen, nicht eine Seite; sie gehört
                zur Gruppe Firma und wird dort in der Vorschau gezeigt.

   `site` ist kein Pfad, sondern der Standardtitel des Auftritts
   (meta.siteTitle / meta.siteDescription) — er greift überall dort, wo eine
   Seite keinen eigenen Titel setzt. */
export const SEO_ENTRIES = Object.freeze([
  { key: "site", route: null, fields: { title: "siteTitle", description: "siteDescription" } },
  { key: "home", route: "/" },
  { key: "collection", route: "/unsere-weine" },
  { key: "shop", route: "/shop" },
  { key: "geschichte", route: "/geschichte" },
  { key: "magazin", route: "/magazin" },
  { key: "regionen", route: "/regionen" },
  { key: "kontakt", route: "/kontakt" },
  { key: "agb", route: "/agb" },
  { key: "datenschutz", route: "/datenschutz" },
  { key: "impressum", route: "/impressum" },
]);

export const SEO_KEYS = Object.freeze(SEO_ENTRIES.map((e) => e.key));

export const isSeoKey = (v) => SEO_KEYS.includes(v);

export const seoEntry = (key) => SEO_ENTRIES.find((e) => e.key === key) ?? null;

/* Welches Feld der Inhaltsdatei den Titel trägt.

   Die meisten Seiten setzen `title` und bekommen den Markennamen aus dem
   title.template des Root-Layouts angehängt. Startseite, Regionen und
   Kontakt setzen stattdessen `titleAbsolute`: Ihr Titel führt die Marke
   selbst („… | Maria Maria"), das Template würde sie ein zweites Mal
   anhängen. Fürs Zeichenbudget ist der Unterschied entscheidend — deshalb
   reicht der Store beides bis in den Editor durch. */
export const titleFieldOf = (seed) =>
  seed && typeof seed.titleAbsolute === "string" ? "titleAbsolute" : "title";

/**
 * Der Titel, wie er im Tab und in der Ergebniszeile steht — also inklusive
 * des Markensuffixes, das die Seite nicht selbst schreibt. Genau diese
 * Länge zählt gegen das Budget; die reine Feldlänge wäre bei jeder Seite
 * ohne `titleAbsolute` um vierzehn Zeichen zu optimistisch.
 */
export function renderedTitle(value, { absolute = false, brandSuffix = "" } = {}) {
  const text = typeof value === "string" ? value : "";
  if (absolute || !text) return text;
  return `${text}${brandSuffix}`;
}

/* --------------------------------------------------- Weiterleitungen ------ */

export const REDIRECT_KINDS = Object.freeze(["exact", "prefix"]);

export const REDIRECT_MAX = Object.freeze({ path: 300, entries: 200 });

/* Wie oft eine Adresse weitergereicht werden darf, bevor abgebrochen wird —
   dieselbe Obergrenze wie in canonicalPath(). Sie ist ein Schleifenschutz:
   Trüge die Tabelle je einen Zyklus, bliebe die Seite sonst hängen. */
export const REDIRECT_MAX_HOPS = 4;

const PATH_RE = /^\/[^\s?#]*$/;

/** "/galerie/" → "/galerie"; "/" bleibt "/". Wie in canonicalPath(). */
export const stripTrailingSlash = (path) =>
  path.length > 1 ? path.replace(/\/+$/, "") || "/" : path;

/**
 * Eine einzelne Regel auf einen Pfad anwenden.
 * `exact`  trifft den Pfad ganz; `prefix` trifft ihn selbst und alles
 * darunter und behält den Rest ("/weine/lugana" → "/unsere-weine/lugana").
 */
export function applyRedirect(rule, path) {
  if (!rule || typeof path !== "string") return null;
  const from = stripTrailingSlash(rule.from ?? "");
  if (!from) return null;

  if (rule.kind === "prefix") {
    if (path === from) return rule.to;
    if (path.startsWith(`${from}/`)) return `${rule.to}${path.slice(from.length)}`;
    return null;
  }
  return path === from ? rule.to : null;
}

/**
 * Wo eine Adresse am Ende landet — die Rechnung hinter dem Testknopf.
 *
 * Bildet canonicalPath() aus middleware.js nach: Schrägstrich am Ende weg,
 * das redundante /de-Präfix weg, dann die Tabelle bis zum Fixpunkt. Der Weg
 * wird mitprotokolliert, weil die interessante Antwort selten nur das Ziel
 * ist: Eine Kette über zwei Regeln ist genau das, was middleware.js in EINE
 * Antwort zusammenrechnet, und sie hier zu sehen erklärt, warum.
 *
 * @returns {{ input, target, chain: string[], hops: number, changed: boolean,
 *             loop: boolean, matched: object[] }}
 */
export function resolveRedirect(input, rules = [], { defaultLocale = "de" } = {}) {
  const raw = typeof input === "string" ? input.trim() : "";
  const start = raw.startsWith("/") ? raw : `/${raw}`;

  let path = stripTrailingSlash(start.split(/[?#]/)[0]);

  const [, first = ""] = path.split("/");
  if (first === defaultLocale) path = path.slice(defaultLocale.length + 1) || "/";

  const chain = [path];
  const matched = [];
  let loop = false;

  for (let round = 0; round < REDIRECT_MAX_HOPS; round++) {
    let next = null;
    let rule = null;
    for (const candidate of rules) {
      const hit = applyRedirect(candidate, path);
      if (hit != null) {
        next = hit;
        rule = candidate;
        break;
      }
    }
    if (next == null || next === path) break;
    if (chain.includes(next)) {
      loop = true;
      break;
    }
    matched.push(rule);
    path = next;
    chain.push(path);
  }

  return {
    input: start,
    target: path,
    chain,
    hops: chain.length - 1,
    changed: path !== stripTrailingSlash(start.split(/[?#]/)[0]),
    loop,
    matched,
  };
}

/* ------------------------------------------------------------- Prüfung ---- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/* Großzügig: Ziffern, Leerzeichen, Klammern, Bindestrich, führendes Plus.
   Streng genug, um einen Tippfehler wie „Tel. 0211…" abzufangen. */
const PHONE_RE = /^\+?[\d][\d\s().\-/]{4,}$/;

const isStr = (v) => typeof v === "string";
const trimmed = (v) => (isStr(v) ? v.trim() : "");

/** Strukturprüfung eines Firma-Patches. Leeres Array = gültig. */
export function validateBusiness(patch = {}) {
  const errs = [];
  for (const [key, value] of Object.entries(patch)) {
    const field = BUSINESS_FIELDS.find((f) => f.key === key);
    if (!field) {
      errs.push(`unknown business field "${key}"`);
      continue;
    }
    if (!isStr(value)) {
      errs.push(`firma.${key} must be a string`);
      continue;
    }
    const v = value.trim();
    if (!v) {
      if (field.required) errs.push(`firma.${key} must not be empty`);
      continue;
    }
    if (v.length > field.max) {
      errs.push(`firma.${key} exceeds ${field.max} characters (${v.length})`);
    }
    if (field.kind === "email" && !EMAIL_RE.test(v)) {
      errs.push(`firma.${key} is not a valid e-mail address`);
    }
    if (field.kind === "phone" && !PHONE_RE.test(v)) {
      errs.push(`firma.${key} is not a valid phone number`);
    }
  }
  return errs;
}

/** Strukturprüfung eines Social-Patches. Leeres Array = gültig. */
export function validateSocial(patch = {}) {
  const errs = [];
  for (const [key, value] of Object.entries(patch)) {
    const field = SOCIAL_FIELDS.find((f) => f.key === key);
    if (!field) {
      errs.push(`unknown social field "${key}"`);
      continue;
    }
    if (!isStr(value)) {
      errs.push(`social.${key} must be a string`);
      continue;
    }
    const v = value.trim();
    /* Leer heißt „dieses Profil gibt es nicht" — und ist erlaubt: Das Profil
       fällt dann aus `sameAs`, statt als tote Adresse darin zu stehen. */
    if (!v) continue;
    if (v.length > field.max) {
      errs.push(`social.${key} exceeds ${field.max} characters (${v.length})`);
    }
    if (field.kind === "url") {
      let url;
      try {
        url = new URL(v);
      } catch {
        errs.push(`social.${key} must be a full https:// address`);
        continue;
      }
      if (url.protocol !== "https:") {
        errs.push(`social.${key} must use https://`);
      } else if (field.host && !url.hostname.endsWith(field.host)) {
        errs.push(`social.${key} must point at ${field.host}`);
      }
    }
    if (field.kind === "handle" && !/^@[\w.]{1,30}$/.test(v)) {
      errs.push(`social.${key} must look like @name`);
    }
  }
  return errs;
}

/** Strukturprüfung eines SEO-Patches: { [page]: { title, description } }. */
export function validateSeo(patch = {}, { locales = [] } = {}) {
  const errs = [];
  for (const [locale, pages] of Object.entries(patch)) {
    if (locales.length && !locales.includes(locale)) {
      errs.push(`unknown locale "${locale}"`);
      continue;
    }
    if (pages === null || typeof pages !== "object") {
      errs.push(`seo.${locale} must be an object`);
      continue;
    }
    for (const [page, value] of Object.entries(pages)) {
      if (!isSeoKey(page)) {
        errs.push(`unknown page "${page}"`);
        continue;
      }
      if (value === null || typeof value !== "object") {
        errs.push(`seo.${locale}.${page} must be an object`);
        continue;
      }
      for (const [field, text] of Object.entries(value)) {
        if (field !== "title" && field !== "description") {
          errs.push(`seo.${locale}.${page}.${field} is not editable`);
          continue;
        }
        if (!isStr(text)) {
          errs.push(`seo.${locale}.${page}.${field} must be a string`);
          continue;
        }
        const v = text.trim();
        if (!v) {
          errs.push(`seo.${locale}.${page}.${field} must not be empty`);
          continue;
        }
        if (v.length > SEO_MAX[field]) {
          errs.push(
            `seo.${locale}.${page}.${field} exceeds ${SEO_MAX[field]} characters (${v.length})`,
          );
        }
      }
    }
  }
  return errs;
}

/** Strukturprüfung der Weiterleitungsliste. Leeres Array = gültig. */
export function validateRedirects(list) {
  const errs = [];
  if (!Array.isArray(list)) return ["redirects must be an array"];
  if (list.length > REDIRECT_MAX.entries) {
    errs.push(`redirects: at most ${REDIRECT_MAX.entries} entries (${list.length})`);
  }

  const seen = new Map();
  list.forEach((rule, i) => {
    const at = `redirects[${i}]`;
    if (rule === null || typeof rule !== "object") {
      errs.push(`${at} must be an object`);
      return;
    }
    const from = trimmed(rule.from);
    const to = trimmed(rule.to);
    const kind = rule.kind ?? "exact";

    if (!REDIRECT_KINDS.includes(kind)) {
      errs.push(`${at}.kind must be one of ${REDIRECT_KINDS.join(", ")}`);
    }
    for (const [name, value] of [
      ["from", from],
      ["to", to],
    ]) {
      if (!value) {
        errs.push(`${at}.${name} must not be empty`);
      } else if (!PATH_RE.test(value)) {
        errs.push(`${at}.${name} must be a path starting with "/" and free of ? and #`);
      } else if (value.length > REDIRECT_MAX.path) {
        errs.push(`${at}.${name} exceeds ${REDIRECT_MAX.path} characters`);
      }
    }
    if (from && to && stripTrailingSlash(from) === stripTrailingSlash(to)) {
      /* Eine Regel, die auf sich selbst zeigt, ist keine Weiterleitung
         sondern eine Endlosschleife mit Zwischenschritt. */
      errs.push(`${at}: "from" and "to" are the same address`);
    }
    const dupKey = `${kind}:${stripTrailingSlash(from)}`;
    if (from) {
      if (seen.has(dupKey)) {
        errs.push(`${at}.from duplicates redirects[${seen.get(dupKey)}] — only the first would ever match`);
      } else {
        seen.set(dupKey, i);
      }
    }
  });

  return errs;
}

/** Alle vier Gruppen auf einmal — die Prüfung des Schreibpfads. */
export function validateSettingsPatch(patch = {}, { locales = [] } = {}) {
  const errs = [];
  for (const key of Object.keys(patch)) {
    if (!isSettingsGroup(key)) errs.push(`unknown settings group "${key}"`);
  }
  if (patch.firma !== undefined) errs.push(...validateBusiness(patch.firma));
  if (patch.social !== undefined) errs.push(...validateSocial(patch.social));
  if (patch.seo !== undefined) errs.push(...validateSeo(patch.seo, { locales }));
  if (patch.redirects !== undefined) errs.push(...validateRedirects(patch.redirects));
  return errs;
}

/* ------------------------------------------------------------ Normalform -- */

/** Getrimmte Fassung einer Regel — die Form, in der sie gespeichert wird. */
export const normalizeRedirect = (rule) => ({
  from: stripTrailingSlash(trimmed(rule?.from)),
  to: trimmed(rule?.to),
  kind: REDIRECT_KINDS.includes(rule?.kind) ? rule.kind : "exact",
});

/* ------------------------------------------------- Strukturierte Daten ---- */

/**
 * Firma und Profile über einen fertigen Organization-Knoten legen.
 *
 * Der Knoten selbst kommt aus lib/seo/jsonLd.js — also aus der Quelle, die
 * die Seite wirklich ausliefert. Hier werden nur die Werte ersetzt, die auf
 * dieser Einstellungsseite gepflegt werden. Dadurch ist die Vorschau
 * strukturell immer aktuell und muss bei jeder Änderung am echten Knoten
 * nicht nachgezogen werden.
 *
 * Reine Funktion ohne Import: Der Server baut damit die Antwort, der Editor
 * rechnet dieselbe Vorschau bei jedem Tastendruck neu, ohne dafür zu fragen.
 */
export function applyIdentityToNode(node, business = {}, social = {}) {
  if (!node || typeof node !== "object") return node;

  const email = trimmed(business.email);
  const phone = trimmed(business.phone);

  /* Reihenfolge wie in SOCIAL_FIELDS; leere Felder fallen heraus, statt als
     tote Adresse in `sameAs` zu stehen. */
  const sameAs = SOCIAL_FIELDS.filter((f) => f.kind === "url")
    .map((f) => trimmed(social[f.key]))
    .filter(Boolean);

  const out = {
    ...node,
    legalName: trimmed(business.legalName) || node.legalName,
    address: {
      ...node.address,
      streetAddress: trimmed(business.street) || node.address?.streetAddress,
      postalCode: trimmed(business.postalCode) || node.address?.postalCode,
      addressLocality: trimmed(business.city) || node.address?.addressLocality,
    },
    ...(email ? { email } : null),
    contactPoint: {
      ...node.contactPoint,
      ...(email ? { email } : null),
    },
    sameAs,
  };

  /* Die Telefonnummer erscheint NUR, wenn eine gepflegt ist. Ein leeres
     `telephone` im Graphen wäre schlimmer als gar keines: Google übernimmt
     die Angabe in den Wissensgraph, und eine falsche oder leere Nummer ist
     von dort schwer wieder herauszubekommen. */
  if (phone) {
    out.telephone = phone;
    out.contactPoint.telephone = phone;
  } else {
    delete out.telephone;
    delete out.contactPoint.telephone;
  }

  return out;
}
