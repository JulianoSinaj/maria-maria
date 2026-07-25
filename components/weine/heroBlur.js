/* AUTOGENERIERT von scripts/optimize-heroes.mjs — nicht von Hand bearbeiten.

   Winzige (20 px breite) WebP-Vorschauen der Hero-Fotos als Data-URI. Sie
   stehen im server-gerenderten Markup und füllen die Bühne sofort, während
   das volle Foto noch lädt — kein weißer Blitz mehr beim Seitenaufruf. */

export const HERO_BLUR = {
  "falanghina": "data:image/webp;base64,UklGRogAAABXRUJQVlA4IHwAAAAwBACdASoUAAwAPxl0slCspqSisAgBkCMJbACdMoRwACa82w7CKKgIwIAA/mRVXdV2cBJvxVVvuGlXmT77hnyX9KgYsoAcleBQX80K1W9Nrvw7yHItdGLpCYWyWcVa/wS2P386i0TSgGdJL4s4+8PrBiGTvQvAgCrSVhQA",
  "greco-di-tufo": "data:image/webp;base64,UklGRoYAAABXRUJQVlA4IHoAAAAQBACdASoUAAwAPxl0sVCspqSisAgBkCMJbACdMoRwAA1FHJHY1096AAD+ZFVaXlDmrOVFuALqinmQrhSBiEH9AbRxDnI8WeknUi+uRnT2/Vf5yVNcubUyg6qxkgK1d3z/RMLKXgO1xSNi4DPiAwYrlVLuBYGUR6gAAA==",
  "il-bianco-greco-cuvee": "data:image/webp;base64,UklGRogAAABXRUJQVlA4IHwAAAAQBACdASoUAAwAPxl0slEspqSisAgBkCMJbACdMoRwJoABKUbsIaRU8AD+ZFVd1XdjZyb8ZRVkN+7wqPtAede7+FcZxetU5ZYxx7ddozG7N1jyvu8L899uFMmKuGk4MPuiMEIPcm0KiMA+S+Lhl8RGqwf4ve6QM/NiYQAA",
  "il-rosso-aglianico": "data:image/webp;base64,UklGRogAAABXRUJQVlA4IHwAAAAwBACdASoUAAwAPxl0sVCspqSisAgBkCMJbACdMoRwABKB/vPBtDGlQAAA/mR5nwsN/1sJHUy2ChS30NOcLRQ7j23rKzT0mwKvkNSL65GdPb9V/nJU1U46DtjpZCXXof9fYRbBZ4kPG3ySqE+mxgu9TkFEexicBdxKnFwA",
  "lugana": "data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAADwAwCdASoUAAwAPxl2sVCspySisAgBkCMJbACdMoRwABf8hrKLBIAAAP5keZ8LDf8K/2I2AkNYUV4UJqjc5RkUmmPKPHrLedHOKAXw1kLdv1kvlaDsQP7jol8Y/SZSw0D/IUij0nbAaYroh0meAtBB3GK30h+gnhR0vomiAAA=",
  "primitivo-14-5": "data:image/webp;base64,UklGRogAAABXRUJQVlA4IHwAAACQBACdASoUAAwAPxl2slEspySisAgBkCMJbACdMoR3JoAC+6slqTuk5DDtXgAA/dRFZn+Tbubfd8rrxOq/M5D8YwCoCYk1Slz7s/wfvl5X7aoBFHchrq2SjrnFoJcWxgg/FoKEnn068eh9YMQs4+8O8pXRJbotKY0rAAAA",
  "primitivo-15-5": "data:image/webp;base64,UklGRo4AAABXRUJQVlA4IIIAAAAQBACdASoUAA0APxl0sVCspqSisAgBkCMJbACdMoRwDg/wIq8QhvO+IAD+BoeT898SopPP99zda9iXbzUur/5mb8QEQqy9IyZB81fSnkWdR9tNZALkDuI6WxXPXU/GqRpYt9TxLwM526ZXhSSqQsfYn24T0bjMR3QGgnlHSzVaxMAA",
  "primitivo-salento": "data:image/webp;base64,UklGRo4AAABXRUJQVlA4IIIAAAAwBACdASoUAAwAPxl2slEspySisAgBkCMJbACdMoRwABmzDDJQvk7vQAAA/mR5nY5ag61NEuLOZmtiDAjoIGT9EHDDQ7xqM/Cubv2PCp2t9tOvFqV8byyKRwhVue24Rbu8GRotf59ET6hAyu88wuPkM+IDBd6nIJXXOsBi+FxSGAAA",
  "rosato-puglia": "data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAADwAwCdASoUAAwAPxl2slEspySisAgBkCMJbACdMoRwAAvTXBMEIOAAAP5kVVpeVHz1wzN+MoqyG/gGIbS8cZelnnoQSspjvectp1Ttb65Xsu6loGo9+suueccgwIwtiM8O90Rglg/Y0M75L4s4+8PrBiGr+nzONoEKaY5PuAA="
};

export const heroBlurFor = (slug) => HERO_BLUR[slug] ?? null;
