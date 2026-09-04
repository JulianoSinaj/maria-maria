/* Einstellungen — der Store der Seiteneinstellungen.
   ==========================================================================
   Vier Gruppen, ein Muster: Der Code ist die Saat, der Store hält nur die
   Abweichungen davon. Ein Feld ohne Eintrag IST der Code; wer den
   Originalwert zurücktippt, hat wieder den Code, und der Eintrag verschwindet.
   Ein leerer Store heißt: exakt das, was heute ausgeliefert wird.

   Woher die Saat kommt:

     firma      BUSINESS            lib/site.js
     social     SOCIAL_PROFILES     lib/site.js
                SOCIAL_HANDLE       components/magazin/magazinData.js
     seo        meta                content/<sprache>/meta.js
     redirects  LEGACY_PATHS        middleware.js  (gespiegelt, siehe unten)

   PERSISTENZ. Anders als die älteren Admin-Stores (Bestand, Hero, Karte),
   die nur in globalThis leben, schreibt dieser hier auf die Platte:
   data/settings/settings.json, write-then-rename. Der Grund ist der Inhalt —
   eine bestätigte Telefonnummer, vier Sprachen SEO-Texte und die Tabelle der
   Alt-Adressen sind mühsam erarbeitete Angaben, keine Vorschau-Einstellungen.
   Auf einem schreibgeschützten Dateisystem (serverlose Container) scheitert
   der Schreibvorgang einmal, wird einmal protokolliert, und der Store läuft
   im Arbeitsspeicher weiter; die Seite sagt das dann auch. Auf dem Server
   MUSS data/ ein persistentes Volume sein — dieselbe Bedingung, unter der
   auch das Passwort der Kundin überlebt (lib/admin/credentials.js).

   NICHT VERDRAHTET. Der Store ist die Quelle, gelesen wird er noch nicht:
   Footer, Impressum, JSON-LD und die Middleware ziehen ihre Werte weiterhin
   direkt aus dem Code. Was dafür fehlt, steht in effectiveSettings() —
   bewusst als ein Aufruf, damit die Verdrahtung später eine Zeile je
   Verbraucher ist und nicht eine Suche durch den Baum. */

import fs from "node:fs";
import path from "node:path";
import { BUSINESS, SOCIAL_PROFILES, SITE_NAME } from "@/lib/site";
import { SOCIAL_HANDLE } from "@/components/magazin/magazinData";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n/config";
import {
  BUSINESS_KEYS,
  SEO_ENTRIES,
  SOCIAL_KEYS,
  isSeoKey,
  normalizeRedirect,
  titleFieldOf,
  validateSettingsPatch,
} from "./schema";

if (typeof window !== "undefined") {
  throw new Error(
    "lib/settings/store ist serverseitig — der Editor spricht mit /api/admin/settings, " +
      "Struktur und Prüfungen liegen in lib/settings/schema.",
  );
}

const FILE_VERSION = 1;

const storeFile = () =>
  process.env.MM_SETTINGS_FILE || path.join(process.cwd(), "data", "settings", "settings.json");

/* Eine Instanz, ein Store: `next dev` übersetzt jede Route in ihren eigenen
   Modulgraphen, eine modul-lokale Bindung teilte den Zustand zwischen den
   Routen auf. */
globalThis.__mmSettingsStore ??= { overrides: null, persistence: null, warned: false };
const state = globalThis.__mmSettingsStore;

const emptyOverrides = () => ({ firma: {}, social: {}, seo: {}, redirects: null });

/* ---------------------------------------------------------- Persistenz ---- */

function load() {
  if (state.overrides) return state.overrides;
  try {
    const parsed = JSON.parse(fs.readFileSync(storeFile(), "utf8"));
    const stored = parsed?.overrides ?? {};
    state.overrides = {
      firma: stored.firma ?? {},
      social: stored.social ?? {},
      seo: stored.seo ?? {},
      redirects: Array.isArray(stored.redirects) ? stored.redirects : null,
    };
    state.persistence = "file";
  } catch (err) {
    state.overrides = emptyOverrides();
    /* Noch keine Datei ist der normale erste Start — sie entsteht mit der
       ersten Änderung. Alles andere heißt: auf diese Platte ist kein
       Verlass. */
    state.persistence = err?.code === "ENOENT" ? "file" : "memory";
    if (err?.code !== "ENOENT") {
      console.warn(
        `[einstellungen] Datei nicht lesbar (${err?.code ?? err}); Einstellungen nur im Arbeitsspeicher.`,
      );
    }
  }
  return state.overrides;
}

function persist() {
  const file = storeFile();
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    /* write-then-rename: Ein Absturz mitten im Schreiben lässt die vorherige
       Datei unversehrt. */
    const tmp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(
      tmp,
      JSON.stringify({ version: FILE_VERSION, overrides: state.overrides }, null, 2),
    );
    fs.renameSync(tmp, file);
    state.persistence = "file";
  } catch (err) {
    state.persistence = "memory";
    if (!state.warned) {
      state.warned = true;
      console.warn(
        `[einstellungen] Datei nicht schreibbar (${err?.code ?? err}); Einstellungen nur im Arbeitsspeicher.`,
      );
    }
  }
}

/** "file", wenn Änderungen einen Neustart überleben, sonst "memory". */
export function persistenceMode() {
  load();
  return state.persistence;
}

/** Alles zurück auf den Code. Für Tests und den Knopf „Zurücksetzen". */
export function resetSettings(group) {
  load();
  if (group === undefined) {
    state.overrides = emptyOverrides();
  } else if (group === "redirects") {
    state.overrides.redirects = null;
  } else if (group === "firma" || group === "social" || group === "seo") {
    state.overrides[group] = {};
  } else {
    return false;
  }
  persist();
  return true;
}

/* ---------------------------------------------------------------- Saat ---- */

/* Der Markensuffix, den das title.template des Root-Layouts an jeden Titel
   ohne `titleAbsolute` hängt. Fürs Zeichenbudget zählt er mit — siehe
   renderedTitle() im Schema. */
export const BRAND_SUFFIX = ` — ${SITE_NAME}`;

/** Firma, wie sie im Code steht. `phone` fehlt dort ganz; hier ist sie ein
    leeres Feld, damit der Editor sie zeigen kann. */
export function businessSeed() {
  return {
    legalName: BUSINESS.legalName,
    street: BUSINESS.street,
    postalCode: BUSINESS.postalCode,
    city: BUSINESS.city,
    email: BUSINESS.email,
    phone: "",
  };
}

/** Die Angaben, die der Editor zeigt, aber nicht ändert — sie gehören zur
    Anschrift im JSON-LD und wandern nicht mit einem Umzug innerhalb
    Deutschlands. */
export const businessFixed = () => ({
  region: BUSINESS.region,
  country: BUSINESS.country,
  countryName: BUSINESS.countryName,
});

const profileFor = (host) => SOCIAL_PROFILES.find((url) => url.includes(host)) ?? "";

/** Social-Profile, wie sie im Code stehen. */
export function socialSeed() {
  return {
    instagram: profileFor("instagram.com"),
    facebook: profileFor("facebook.com"),
    linkedin: profileFor("linkedin.com"),
    handle: SOCIAL_HANDLE,
  };
}

/* Dieselben vier Zweige wie in lib/i18n/dictionaries — dynamisch, damit pro
   Anfrage nur geladen wird, was gebraucht wird. */
const META_SEEDS = {
  de: () => import("@/content/de/meta"),
  it: () => import("@/content/it/meta"),
  en: () => import("@/content/en/meta"),
  cs: () => import("@/content/cs/meta"),
};

async function metaOf(locale) {
  const load2 = META_SEEDS[locale];
  if (!load2) return null;
  const mod = await load2();
  return mod.meta ?? mod.default ?? null;
}

/**
 * SEO-Saat einer Sprache: je Seite { title, description, absolute }.
 * `absolute` sagt, ob der Titel die Marke selbst trägt (`titleAbsolute`) —
 * davon hängt das Zeichenbudget ab.
 */
export async function seoSeed(locale) {
  const meta = await metaOf(locale);
  if (!meta) return {};

  const out = {};
  for (const entry of SEO_ENTRIES) {
    if (entry.fields) {
      /* Der Auftritts-Standardtitel steht flach in meta, nicht in einem
         Unterobjekt: meta.siteTitle / meta.siteDescription. */
      out[entry.key] = {
        title: meta[entry.fields.title] ?? "",
        description: meta[entry.fields.description] ?? "",
        absolute: true,
      };
      continue;
    }
    const seed = meta[entry.key];
    if (!seed) continue;
    const field = titleFieldOf(seed);
    out[entry.key] = {
      title: seed[field] ?? "",
      description: seed.description ?? "",
      absolute: field === "titleAbsolute",
    };
  }
  return out;
}

/* ---------------------------------------------------- Weiterleitungen ----- */

/* SPIEGEL von LEGACY_PATHS in middleware.js — bewusst eine Kopie.
   ------------------------------------------------------------------
   Die Tabelle dort ist eine modul-lokale Konstante und wird nicht
   exportiert; middleware.js läuft auf der Edge-Runtime und importiert
   nichts, was ein Dateisystem anfassen könnte. Sie von hier zu importieren
   hieße, den Store in die Middleware zu ziehen — genau das, wovor der
   Auftrag warnt („die Middleware läuft am Rand, Weiterleitungen sollten
   gecacht werden, etwa in der Vercel Edge Config, statt bei jeder Anfrage
   aus der Datenbank gelesen zu werden").

   Damit die Kopie nicht davonläuft, prüft der Test in
   lib/settings/__tests__/api.test.mjs die Tabelle in middleware.js gegen
   diese Liste und schlägt fehl, sobald eine Zeile nur an einer Stelle
   geändert wurde. Eine stille Abweichung wird so zu einer lauten.

   Die zwei Präfixregeln aus legacyTarget() stehen hier als `kind: "prefix"`
   in derselben Liste: Sie sind Weiterleitungen wie jede andere und gehören
   für die Redaktion sichtbar dazu, statt im Code versteckt zu bleiben. */
export const REDIRECT_SEED = Object.freeze([
  { from: "/home", to: "/", kind: "exact" },
  { from: "/ueber-uns", to: "/geschichte", kind: "exact" },
  { from: "/vision", to: "/geschichte", kind: "exact" },
  { from: "/galerie", to: "/geschichte", kind: "exact" },
  { from: "/news", to: "/magazin", kind: "exact" },
  { from: "/primitivo-di-manduria", to: "/regionen", kind: "exact" },
  { from: "/lugana-doc", to: "/unsere-weine/lugana", kind: "exact" },
  { from: "/unsere-weine/lugana-doc", to: "/unsere-weine/lugana", kind: "exact" },
  { from: "/unsere-weine/primitivo-145-2", to: "/unsere-weine/primitivo-14-5", kind: "exact" },
  { from: "/unsere-weine/primitivo-145-2-old", to: "/unsere-weine/primitivo-14-5", kind: "exact" },
  { from: "/unsere-weine/primitivo-155", to: "/unsere-weine/primitivo-15-5", kind: "exact" },
  { from: "/unsere-weine/greco-di-tufo-d-o-c-g", to: "/unsere-weine/greco-di-tufo", kind: "exact" },
  {
    from: "/unsere-weine/riviera-del-garda-classico-chiaretto-dop",
    to: "/unsere-weine",
    kind: "exact",
  },
  { from: "/datenschutzerklaerung", to: "/datenschutz", kind: "exact" },
  /* aus legacyTarget(): die Kollektion liegt seit dem Route-Umzug unter
     /unsere-weine — Übersicht und alle neun Produktseiten */
  { from: "/weine", to: "/unsere-weine", kind: "prefix" },
]);

export const redirectSeed = () => REDIRECT_SEED.map((rule) => ({ ...rule }));

/* -------------------------------------------------------------- Lesen ----- */

const overridesOf = () => load();

/** Firma mit angewandten Änderungen. */
export function effectiveBusiness() {
  return { ...businessSeed(), ...overridesOf().firma };
}

/** Social mit angewandten Änderungen. */
export function effectiveSocial() {
  return { ...socialSeed(), ...overridesOf().social };
}

/** Die Weiterleitungen, die gelten — die Liste im Store oder, solange keine
    gespeichert ist, die des Codes. */
export function effectiveRedirects() {
  const stored = overridesOf().redirects;
  return stored ? stored.map((rule) => ({ ...rule })) : redirectSeed();
}

/** Metatexte einer Sprache mit angewandten Änderungen — je Seite
    { title, description, absolute }. */
export async function effectiveSeo(locale) {
  const seed = await seoSeed(locale);
  const over = overridesOf().seo?.[locale] ?? {};
  const out = {};
  for (const [page, values] of Object.entries(seed)) {
    out[page] = { ...values, ...(over[page] ?? {}) };
  }
  return out;
}

/**
 * Alles, was die Storefront von hier bräuchte, in einem Aufruf.
 *
 * NOCH LIEST DAS NIEMAND. Die Verbraucher stehen namentlich dabei, damit die
 * Verdrahtung später keine Suche ist:
 *
 *   business  → lib/seo/jsonLd.js organizationNode() (address, email,
 *               telephone, contactPoint), components/Footer.jsx (E-Mail),
 *               app/api/contact/route.js (Empfänger), Impressum-Text in
 *               content/<sprache>/legal.js
 *   social    → SOCIAL_PROFILES als `sameAs` im JSON-LD,
 *               components/Footer.jsx (Icon-Reihe),
 *               components/magazin/SocialBoard.jsx (Handle + Link)
 *   seo       → lib/i18n/metadata.js pageMetadata() über dict.meta
 *   redirects → LEGACY_PATHS in middleware.js; am Rand nur über einen Cache
 *               (Vercel Edge Config) sinnvoll, nicht als Dateizugriff
 */
export async function effectiveSettings(locale = DEFAULT_LOCALE) {
  return {
    business: effectiveBusiness(),
    social: effectiveSocial(),
    seo: await effectiveSeo(locale),
    redirects: effectiveRedirects(),
    persistence: persistenceMode(),
  };
}

/* Ein Feld gilt als geändert, wenn ein Eintrag existiert — und Einträge, die
   dem Code gleichen, entstehen gar nicht erst (siehe putSettings). */
const changedKeys = (group) => Object.keys(overridesOf()[group] ?? {});

/** Welche Felder vom Code abweichen — die Zähler der Gruppenköpfe. */
export function changeSummary() {
  const over = overridesOf();
  const seo = {};
  let seoCount = 0;
  for (const [locale, pages] of Object.entries(over.seo ?? {})) {
    for (const [page, fields] of Object.entries(pages ?? {})) {
      const keys = Object.keys(fields ?? {});
      if (!keys.length) continue;
      ((seo[locale] ??= {})[page] = keys);
      seoCount += keys.length;
    }
  }
  return {
    firma: changedKeys("firma"),
    social: changedKeys("social"),
    seo,
    seoCount,
    redirects: over.redirects ? over.redirects.length : 0,
    redirectsChanged: Boolean(over.redirects),
    persistence: persistenceMode(),
  };
}

/**
 * Der vollständige Datensatz für den Editor: Saat und geltender Wert je
 * Feld, plus die Sprachen und festen Angaben, die die Seite anzeigt.
 */
export async function getSettingsRecord() {
  const [firmaSeed, socialSeedValues] = [businessSeed(), socialSeed()];
  const over = overridesOf();

  const seo = {};
  for (const locale of LOCALES) {
    const seed = await seoSeed(locale);
    const localeOver = over.seo?.[locale] ?? {};
    seo[locale] = Object.fromEntries(
      Object.entries(seed).map(([page, values]) => [
        page,
        {
          seed: { title: values.title, description: values.description },
          value: {
            title: localeOver[page]?.title ?? values.title,
            description: localeOver[page]?.description ?? values.description,
          },
          absolute: values.absolute,
          changed: Object.keys(localeOver[page] ?? {}),
        },
      ]),
    );
  }

  return {
    firma: { seed: firmaSeed, value: effectiveBusiness(), fixed: businessFixed() },
    social: { seed: socialSeedValues, value: effectiveSocial() },
    seo,
    redirects: {
      seed: redirectSeed(),
      value: effectiveRedirects(),
      changed: Boolean(over.redirects),
    },
    locales: LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    brandSuffix: BRAND_SUFFIX,
    summary: changeSummary(),
  };
}

/* ------------------------------------------------------------ Schreiben --- */

/* Ein Wert, der der Saat gleicht, wird nicht gespeichert, sondern gelöscht:
   Wer den Originaltext zurücktippt, hat wieder den Code — und eine spätere
   Änderung im Repository erreicht die Seite dann auch wieder. */
function mergeFlat(group, patch, seed) {
  const over = { ...overridesOf()[group] };
  for (const [key, raw] of Object.entries(patch)) {
    const value = typeof raw === "string" ? raw.trim() : raw;
    if (value === seed[key]) delete over[key];
    else over[key] = value;
  }
  state.overrides[group] = over;
}

/**
 * Änderungen übernehmen. Der Patch ist partiell: Was nicht darin steht,
 * bleibt unangetastet — auch innerhalb einer Gruppe.
 *
 * @returns {{ errors?: string[] }} — leer bei Erfolg
 */
export async function putSettings(patch = {}) {
  const errors = validateSettingsPatch(patch, { locales: LOCALES });
  if (errors.length) return { errors };

  load();

  if (patch.firma) mergeFlat("firma", patch.firma, businessSeed());
  if (patch.social) mergeFlat("social", patch.social, socialSeed());

  if (patch.seo) {
    const seo = { ...state.overrides.seo };
    for (const [locale, pages] of Object.entries(patch.seo)) {
      const seed = await seoSeed(locale);
      const byPage = { ...(seo[locale] ?? {}) };
      for (const [page, fields] of Object.entries(pages)) {
        if (!isSeoKey(page)) continue;
        const entry = { ...(byPage[page] ?? {}) };
        for (const [field, raw] of Object.entries(fields)) {
          const value = typeof raw === "string" ? raw.trim() : raw;
          if (value === seed[page]?.[field]) delete entry[field];
          else entry[field] = value;
        }
        if (Object.keys(entry).length) byPage[page] = entry;
        else delete byPage[page];
      }
      if (Object.keys(byPage).length) seo[locale] = byPage;
      else delete seo[locale];
    }
    state.overrides.seo = seo;
  }

  if (patch.redirects) {
    const list = patch.redirects.map(normalizeRedirect);
    const seed = redirectSeed();
    const same =
      list.length === seed.length &&
      list.every((rule, i) => rule.from === seed[i].from && rule.to === seed[i].to && rule.kind === seed[i].kind);
    state.overrides.redirects = same ? null : list;
  }

  persist();
  return {};
}

/* Für die Tests: welche Felder unverändert im Store liegen. */
export const rawOverrides = () => structuredClone(overridesOf());

export { BUSINESS_KEYS, SOCIAL_KEYS };
