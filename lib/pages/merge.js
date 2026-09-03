/* Seiten-Editor — die reinen Helfer: Pfade, Merge, Formprüfung.
   Ohne Import, ohne Zustand, ohne React: Browser (Editor), Server (Store,
   Wörterbuch-Merge) und der Node-Test teilen sich diese Datei. */

export const pathOf = (blockKey) => String(blockKey).split(".");

export const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export function getAt(obj, path) {
  let cur = obj;
  for (const key of path) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = cur[key];
  }
  return cur;
}

/* Immutabel: kopiert nur entlang des Pfads, alles andere behält seine
   Referenz — das Wörterbuch aus dem Modul-Cache wird nie angefasst. */
export function setAt(obj, path, value) {
  if (!path.length) return value;
  const [head, ...rest] = path;
  if (Array.isArray(obj)) {
    const copy = obj.slice();
    copy[Number(head)] = setAt(obj[Number(head)], rest, value);
    return copy;
  }
  const base = isPlainObject(obj) ? obj : {};
  return { ...base, [head]: setAt(base[head], rest, value) };
}

export function deepEqual(a, b) {
  if (a === b) return true;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i]));
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const keysA = Object.keys(a);
    if (keysA.length !== Object.keys(b).length) return false;
    return keysA.every(
      (key) => Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key]),
    );
  }
  return false;
}

/* overrides: { [page]: { [blockKey]: value } } — der Block ersetzt den
   Zweig des Wörterbuchs vollständig (eins zu eins, siehe blocks.js). */
export function applyOverrides(dict, overrides) {
  if (!overrides) return dict;
  let out = dict;
  for (const [page, blocks] of Object.entries(overrides)) {
    for (const [blockKey, value] of Object.entries(blocks ?? {})) {
      if (value === undefined) continue;
      out = setAt(out, [page, ...pathOf(blockKey)], value);
    }
  }
  return out;
}

export function countStrings(node) {
  if (typeof node === "string") return 1;
  if (Array.isArray(node)) return node.reduce((n, item) => n + countStrings(item), 0);
  if (isPlainObject(node)) return Object.values(node).reduce((n, item) => n + countStrings(item), 0);
  return 0;
}

/* ["moments", "selection", "title"] → "moments.selection.title",
   ["paragraphs", 1] → "paragraphs[1]" */
export const labelOf = (path) =>
  path.reduce((acc, seg) => {
    if (typeof seg === "number" || /^\d+$/.test(String(seg))) return `${acc}[${seg}]`;
    return acc ? `${acc}.${seg}` : String(seg);
  }, "");

/* Ein Wert darf nur ändern, was Text ist: gleiche Schlüssel, gleiche
   Listenlängen, Blätter bleiben Strings, gesperrte Schlüssel (href, id)
   bleiben wörtlich. Leere Strings sind erlaubt — manche Zeilen sind je
   Sprache bewusst leer (regionen.band.titleEnd, magazin.quote.translation).
   Rückgabe: Liste der Verstöße, leer = gültig. */
export function validateAgainstSeed(seed, value, { lockedKeys = [] } = {}) {
  const errors = [];

  const walk = (s, v, path, key) => {
    const label = path.length ? labelOf(path) : "block";

    if (typeof s === "string") {
      if (typeof v !== "string") errors.push(`${label} must be a string`);
      else if (lockedKeys.includes(key) && v !== s)
        errors.push(`${label} is structural and cannot change`);
      return;
    }

    if (Array.isArray(s)) {
      if (!Array.isArray(v)) {
        errors.push(`${label} must be a list`);
        return;
      }
      if (v.length !== s.length) {
        errors.push(`${label} must keep ${s.length} entries (got ${v.length})`);
        return;
      }
      s.forEach((item, i) => walk(item, v[i], [...path, i], key));
      return;
    }

    if (isPlainObject(s)) {
      if (!isPlainObject(v)) {
        errors.push(`${label} must be an object`);
        return;
      }
      for (const k of Object.keys(s)) {
        if (!Object.prototype.hasOwnProperty.call(v, k)) errors.push(`${labelOf([...path, k])} is missing`);
        else walk(s[k], v[k], [...path, k], k);
      }
      for (const k of Object.keys(v)) {
        if (!Object.prototype.hasOwnProperty.call(s, k))
          errors.push(`${labelOf([...path, k])} is not a field of this block`);
      }
      return;
    }

    /* Zahl, Boolean, null — kommt in den Inhaltsdateien nicht vor, bleibt
       aber zur Sicherheit wörtlich. */
    if (JSON.stringify(v) !== JSON.stringify(s)) errors.push(`${label} must stay ${JSON.stringify(s)}`);
  };

  walk(seed, value, [], null);
  return errors;
}
