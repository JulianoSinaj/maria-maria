/* Text overlays for the nine wine pages.

   Each file mirrors the structure of components/weine/<slug>/wineData.js and
   holds ONLY translated text; lib/i18n/winePages.js lays it over the German
   base. Keys that are absent keep the base value — wine names, image paths,
   prices and colours never appear here. */

import falanghina from "./falanghina";
import grecoDiTufo from "./greco-di-tufo";
import ilBianco from "./il-bianco-greco-cuvee";
import ilRosso from "./il-rosso-aglianico";
import lugana from "./lugana";
import primitivo145 from "./primitivo-14-5";
import primitivo155 from "./primitivo-15-5";
import primitivoSalento from "./primitivo-salento";
import rosatoPuglia from "./rosato-puglia";

const weinePages = {
  falanghina,
  "greco-di-tufo": grecoDiTufo,
  "il-bianco-greco-cuvee": ilBianco,
  "il-rosso-aglianico": ilRosso,
  lugana,
  "primitivo-14-5": primitivo145,
  "primitivo-15-5": primitivo155,
  "primitivo-salento": primitivoSalento,
  "rosato-puglia": rosatoPuglia,
};

export default weinePages;
