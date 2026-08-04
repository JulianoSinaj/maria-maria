/* Zentrales Register aller Wein-Landingpages — eine Quelle für die dynamische
   Route app/unsere-weine/[slug]. Neuer Wein: wineData.js anlegen und hier eintragen. */

import { FALANGHINA } from "./falanghina/wineData";
import { GRECO_DI_TUFO } from "./greco-di-tufo/wineData";
import { IL_BIANCO } from "./il-bianco-greco-cuvee/wineData";
import { IL_ROSSO } from "./il-rosso-aglianico/wineData";
import { LUGANA } from "./lugana/wineData";
import { PRIMITIVO_14_5 } from "./primitivo-14-5/wineData";
import { PRIMITIVO_155 } from "./primitivo-15-5/wineData";
import { PRIMITIVO_SALENTO } from "./primitivo-salento/wineData";
import { ROSATO_NEGROAMARO } from "./rosato-puglia/wineData";

const ALL = [
  FALANGHINA,
  GRECO_DI_TUFO,
  IL_BIANCO,
  IL_ROSSO,
  LUGANA,
  PRIMITIVO_14_5,
  PRIMITIVO_155,
  PRIMITIVO_SALENTO,
  ROSATO_NEGROAMARO,
];

export const WINE_PAGES = Object.fromEntries(ALL.map((w) => [w.slug, w]));
export const WINE_SLUGS = ALL.map((w) => w.slug);
