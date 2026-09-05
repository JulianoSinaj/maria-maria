/* The resolve hook itself — see extensionless.mjs for why it exists.

   Only relative specifiers that have no extension are touched, and only by
   trying ".js" then "/index.js". Anything else is handed straight back to the
   default resolver, so a genuinely missing module still fails as a missing
   module rather than as a confusing hook error. */
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const HAS_EXTENSION = /\.[mc]?[jt]sx?$/;

export async function resolve(specifier, context, next) {
  if (specifier.startsWith(".") && !HAS_EXTENSION.test(specifier) && context.parentURL) {
    for (const suffix of [".js", "/index.js"]) {
      const candidate = new URL(specifier + suffix, context.parentURL);
      if (existsSync(fileURLToPath(candidate))) {
        return next(pathToFileURL(fileURLToPath(candidate)).href, context);
      }
    }
  }
  return next(specifier, context);
}
