import { promises as fs } from "node:fs";
import path from "node:path";

/* Backoffice state that has to outlive a restart.
   ==================================================================
   The first generation of admin stores (lib/inventory, lib/assets, lib/map,
   lib/showcase, lib/hero) keep their state in a `globalThis` singleton and
   nothing else: restart the server and every edit is gone. That was the right
   call while the backoffice was a mock — it is the wrong one for the things
   the media manager holds, because an alt text and an image credit are the
   kind of work nobody wants to type twice.

   So these stores write through to a JSON file under data/admin/ and read it
   back on first access. The globalThis cache stays, for exactly the reason it
   exists in the older stores: `next dev` builds each route into its own module
   graph, and a per-module variable would split the state between the route
   that reads and the route that writes.

   data/ is git-ignored runtime state (see .gitignore) and ON THE SERVER IT
   MUST BE A PERSISTENT VOLUME — the same condition data/admin/credentials.json
   already depends on. Without one, a deploy resets these files to their
   defaults, which is the ephemeral behaviour of the older stores again.

   Not a database, and it does not pretend to be one: writes replace the whole
   document, and two editors saving the same section in the same second would
   have the last write win. A single-desk backoffice is exactly the case where
   that is fine to state plainly rather than engineer around. */

const fileFor = (name) => path.join(process.cwd(), "data", "admin", `${name}.json`);

/**
 * A named JSON document with an in-process cache.
 *
 * @param {string} name      file stem under data/admin/
 * @param {() => any} blank  the document a fresh installation starts from
 */
export function jsonStore(name, blank) {
  /* One cache slot per document name, hung off globalThis for the reason in
     the header. `??=` so a hot reload keeps whatever is already loaded. */
  const slot = `__mmJsonStore_${name}`;
  globalThis[slot] ??= { loaded: false, data: null };
  const state = globalThis[slot];

  const read = async () => {
    if (state.loaded) return state.data;
    try {
      const parsed = JSON.parse(await fs.readFile(fileFor(name), "utf8"));
      /* A file that is not an object (hand-edited, truncated mid-write) is
         treated as absent rather than thrown at the caller: the backoffice
         opens on defaults instead of a 500, and the next save repairs it. */
      state.data = parsed && typeof parsed === "object" ? parsed : blank();
    } catch {
      state.data = blank();
    }
    state.loaded = true;
    return state.data;
  };

  const write = async (next) => {
    state.data = next;
    state.loaded = true;
    await fs.mkdir(path.dirname(fileFor(name)), { recursive: true });
    await fs.writeFile(fileFor(name), `${JSON.stringify(next, null, 2)}\n`, "utf8");
    return next;
  };

  return {
    read,
    write,
    /** Read, hand the document to `mutate`, write back what comes out. */
    async update(mutate) {
      return write(await mutate(structuredClone(await read())));
    },
    /** Back to the blank document — used by the API test suites. */
    async reset() {
      await write(blank());
    },
    /** Forget the cache without touching the file (tests, hot reload). */
    forget() {
      state.loaded = false;
      state.data = null;
    },
  };
}
