/* Let bare Node resolve the extensionless imports the bundler resolves.

   The modules under lib/admin/ import each other the way the rest of the app
   does — `from "./roles"`, no extension — because webpack/Turbopack resolve
   that and the repo's style is consistent about it. Plain `node` does not:
   ESM requires the full specifier. Rather than write extensions into app code
   to please the test runner (the tail wagging the dog), the runner brings a
   resolver with it.

   Registered via --import, so it is in place before the suite's first import:

     node --import ./lib/admin/__tests__/extensionless.mjs <suite>
*/
import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./extensionless-hooks.mjs", pathToFileURL(import.meta.filename ?? import.meta.url));
